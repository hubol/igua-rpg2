import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnComputer } from "../mixins/mxn-computer";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objHeliumExhaust } from "../objects/nature/obj-helium-exhaust";
import { RpgCutscene } from "../rpg/rpg-cutscene";
import { RpgPocket } from "../rpg/rpg-pocket";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownUnderneath() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.NewBalltownUnderneath();
    enrichHomeowner(lvl);
    enrichHeliumCreator(lvl);
    enrichTunnel(lvl);
}

function enrichHomeowner(lvl: LvlType.NewBalltownUnderneath) {
    if (RpgProgress.flags.underneath.homeowner.hasClearedHouseOfEnemies) {
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
        }, { speaker: lvl.Homeowner, camera: { start: "pan-to-speaker" } });
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
    const { heliumCreator } = RpgProgress.flags.underneath;
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
                    const pocketItemsCount = RpgPocket.Methods.countTotal(RpgProgress.character.inventory.pocket);

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
                        // TODO need DramaPocket.empty
                        const emptiedPocketItemsCount = RpgPocket.Methods.empty(RpgProgress.character.inventory.pocket);
                        yield sleep(500);
                        // TODO should receive XP bonus for depositing computer chips
                        tank.heliumContent += emptiedPocketItemsCount * 150;
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
            self.isAttackActive = tank.heliumContent > 0 && tank.isValveOpen;
            // TODO not sure if RpgCutscene.isPlaying is the right check
            if (self.isAttackActive && !RpgCutscene.isPlaying) {
                tank.heliumContent = Math.max(0, tank.heliumContent - 1);
            }
        })
        .show();
}

function enrichTunnel(lvl: LvlType.NewBalltownUnderneath) {
    lvl.TunnelLeftDoor.locked = RpgProgress.flags.underneath.tunneler.isLeftDoorLocked;
}
