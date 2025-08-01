import { Container, Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Tx } from "../../assets/textures";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaPocket } from "../drama/drama-pocket";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnBoilFlipH } from "../mixins/mxn-boil-flip-h";
import { mxnComputer } from "../mixins/mxn-computer";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFxHeartBurst } from "../objects/effects/obj-fx-heart-burst";
import { objAngelMiffed } from "../objects/enemies/obj-angel-miffed";
import { objHeliumExhaust } from "../objects/nature/obj-helium-exhaust";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgCutscene } from "../rpg/rpg-cutscene";
import { RpgExperienceRewarder } from "../rpg/rpg-experience-rewarder";
import { RpgPocket } from "../rpg/rpg-pocket";

export function scnNewBalltownUnderneath() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.NewBalltownUnderneath();
    enrichHomeowner(lvl);
    enrichHeliumCreator(lvl);
    enrichTunnel(lvl);
    enrichMagicRisingFace(lvl);

    objAngelMiffed().at(lvl.TestMarker).show();
}

function enrichHomeowner(lvl: LvlType.NewBalltownUnderneath) {
    if (Rpg.flags.underneath.homeowner.hasClearedHouseOfEnemies) {
        lvl.Homeowner.destroy();
        return;
    }

    let receivedPlayerConsent = false;

    const onInteract = lvl.ToHomeownerDoor.interact.onInteract;

    lvl.ToHomeownerDoor.interact.onInteract = () => {
        Cutscene.play(function* () {
            const result = yield* ask(
                "You're going in? I hope it won't make you uncomfy, but is it OK if I lock the door behind you?",
                "Yes",
                "No",
                "I don't understand",
            );

            if (result === 0) {
                yield* show(
                    "Great! I really wanted to make sure that it's okay.",
                    "Besides, it can be fun to get locked in a house!",
                    "...",
                    "Be careful in there. They are firing spikes everywhere. It sucks.",
                );
            }
            else if (result === 1) {
                yield* show("Oh, dang! Yeah, I totally understand. You don't want to get locked in.");
                if (
                    yield* ask(
                        "Would it make you feel better to know that I'll unlock the door after you finish in there?",
                    )
                ) {
                    yield* show("Great to hear :-)", "Good luck in there. You've got this!");
                }
                else {
                    yield* show("Got it, again, totally understand. Let me know if you change your mind.");
                    return;
                }
            }
            else if (result === 2) {
                yield* show(
                    "So basically, there are a bunch of obnoxious angels in my house.",
                    "It would be great if you could remove them, however you see fit!",
                    "But I have trust issues and would prefer if you allow me to lock you in the house until your work is done :-)",
                );

                if (yield* ask("Does that make more sense?")) {
                    if (yield* ask("Awesome! Do you want to go inside, now that you understand?")) {
                        yield* show("Great! Head on in when you are ready.");
                    }
                    else {
                        yield* show("Hey, totally understand. Let me know if you change your mind.");
                        return;
                    }
                }
                else {
                    yield* show("Ah shoot, I'm not sure if I can explain any better than that...");
                    return;
                }
            }

            receivedPlayerConsent = true;
            lvl.ToHomeownerDoor.interact.onInteract = onInteract;
        }, { speaker: lvl.Homeowner, camera: { start: "pan_to_speaker" } });
    };

    lvl.Homeowner.mixin(mxnCutscene, function* () {
        if (receivedPlayerConsent) {
            yield* show("Please enter the door when you are ready.");
            return;
        }
        yield* show("Can you help? They took over my house :-(");
    });
}

function enrichHeliumCreator(lvl: LvlType.NewBalltownUnderneath) {
    const { heliumCreator } = Rpg.flags.underneath;
    const { tank } = heliumCreator;

    lvl.TownUnderneathHeliumCreator
        .mixin(mxnSpeaker, { name: "Pocket HeHe", colorPrimary: 0x08270E, colorSecondary: 0x3F1C3C })
        .mixin(mxnComputer)
        .mixin(mxnCutscene, function* () {
            while (true) {
                const result = yield* ask(
                    `         -=-=-=-=-=-=- Tank status -=-=-=-=-=-=-
                          Valve open: ${tank.isValveOpen ? "Yes" : "No"}
                       Helium content: ${tank.heliumContent}`,
                    tank.isValveOpen ? "Close valve" : "Open valve",
                    "Create helium",
                    "Do nothing",
                );
                if (result === 0) {
                    tank.isValveOpen = !tank.isValveOpen;
                    yield* show(tank.isValveOpen ? "Valve opened." : "Valve closed.");
                }
                else if (result === 1) {
                    const pocketItemsCount = Rpg.inventory.pocket.countTotal();

                    yield* show(
                        "Your pocket items may be converted into helium.",
                        `You currently have ${pocketItemsCount} pocket item(s).`,
                    );

                    if (pocketItemsCount === 0) {
                        yield* show("You cannot create any helium right now.");
                        continue;
                    }

                    if (yield* ask(`Trade ${pocketItemsCount} pocket item(s) for helium?`)) {
                        yield sleep(500);
                        const emptied = yield* DramaPocket.empty(lvl.TownUnderneathHeliumCreator);
                        // TODO feels like this could somehow be done in empty, if recipient type had to be specified!
                        RpgExperienceRewarder.computer.onDepositComputerChips(emptied.items.ComputerChip);
                        tank.heliumContent += emptied.totalItems * 150;
                        yield* show("Helium created.");
                    }
                }
                else {
                    break;
                }
            }
        });

    objHeliumExhaust()
        .at(lvl.HeliumMarker)
        .step((self) => {
            self.state.quick = tank.heliumContent > 1000;
            self.isAttackActive = tank.heliumContent > 0 && tank.isValveOpen;
            // TODO not sure if RpgCutscene.isPlaying is the right check
            if (self.isAttackActive && !RpgCutscene.isPlaying) {
                const delta = self.state.quick ? 4 : 1;
                tank.heliumContent = Math.max(0, tank.heliumContent - delta);
            }
        }, -1)
        .show();

    lvl.HeliumMachineOpenIndicator.step(self => self.visible = tank.isValveOpen);

    objText.SmallDigitsMono("", { tint: 0x385719 })
        .anchored(1, 0.5)
        .step(self => {
            if (tank.heliumContent < 10000) {
                self.text = "" + tank.heliumContent;
                self.pivot.x = 0;
            }
            else {
                self.text = "9999+";
                self.pivot.x = -3;
            }
        })
        .at(lvl.HeliumContentTextMarker)
        .zIndexed(ZIndex.TerrainDecals)
        .show();
}

function enrichTunnel(lvl: LvlType.NewBalltownUnderneath) {
    lvl.TunnelLeftDoor.locked = Rpg.flags.underneath.tunneler.isLeftDoorLocked;
}

function enrichMagicRisingFace(lvl: LvlType.NewBalltownUnderneath) {
    // TODO reward
    // TODO cute sfx, vfx

    const minimumY = lvl.MagicRisingBar.y;

    const group: Container = lvl.MagicRisingFaceGroup;

    let movedByPlayerSteps = 0;

    if (Rpg.flags.underneath.magicalRisingFace.reachedSummit) {
        lvl.MagicRisingFace.y = minimumY;
    }

    let atSummit = false;

    lvl.MagicRisingFace
        .mixin(mxnSpeaker, { name: "Magical Rising Face", colorPrimary: 0x103418, colorSecondary: 0x698826 })
        .step(self => {
            atSummit = self.y <= minimumY;

            if (!atSummit && playerObj.speed.y <= 0 && self.collides(playerObj)) {
                self.y = Math.max(minimumY, self.y + Math.min(-1, playerObj.speed.y));
                movedByPlayerSteps = 10;
            }

            if (movedByPlayerSteps > 0) {
                movedByPlayerSteps--;
                self.texture = Tx.Town.Underneath.RiserFaceSurprise;
            }
            else {
                self.texture = atSummit ? Tx.Town.Underneath.RiserFaceHappy : Tx.Town.Underneath.RiserFace;
            }
        })
        .mixin(mxnBoilFlipH)
        .coro(function* (self) {
            yield () => !atSummit;
            yield () => atSummit;
            Cutscene.play(function* () {
                // TODO lovey SFX
                objFxHeartBurst.many(14, 5).at(self).show();
                yield sleep(1000);
                yield* show("Thank you for bringing joy to this place!!!");
                scene.camera.mode = "move_towards_player";
                yield* DramaQuests.completeQuest("NewBalltownUnderneathMagicRisingFace", self);
                Rpg.flags.underneath.magicalRisingFace.reachedSummit = true;
            }, { speaker: self, camera: { start: "pan_to_speaker" } });
        });

    const barMaskObj = new Graphics()
        .beginFill(0x103418)
        .drawRect(-2, 0, 4, 512)
        .beginFill(0x08270E)
        .drawRect(-2, 128, 4, 512)
        .step(self => self.at(lvl.MagicRisingFace));
    group.addChildAt(barMaskObj, 0);
}
