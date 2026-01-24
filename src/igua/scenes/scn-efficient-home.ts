import { BLEND_MODES } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { factor, interpr, interpvr } from "../../lib/game-engine/routines/interp";
import { onMutate } from "../../lib/game-engine/routines/on-mutate";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene, layers, scene } from "../globals";
import { mxnFxAlphaVisibility } from "../mixins/effects/mxn-fx-alpha-visibility";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnEsotericArtInteractive, objEsotericArt } from "../objects/esoteric/obj-esoteric-art";
import { objEsotericRemovedShoes } from "../objects/esoteric/obj-esoteric-removed-shoes";
import { objHeliumExhaust } from "../objects/nature/obj-helium-exhaust";
import { objFish } from "../objects/obj-fish";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgStatus } from "../rpg/rpg-status";
import { TerrainAttributes } from "../systems/terrain-attributes";

export function scnEfficientHome() {
    Jukebox.play(Mzk.UnforgivableToner);
    scene.camera.defaultMode = "controlled";
    const lvl = Lvl.EfficientHome();
    scene.camera.at(Math.floor(playerObj.x / 512) * 512, Math.floor(playerObj.y / 288) * 288);

    enrichHelium(lvl);
    enrichRoom0(lvl);
    enrichRoom1(lvl);
    enrichRoom2(lvl);
    enrichRoom3(lvl);
}

function enrichHelium(lvl: LvlType.EfficientHome) {
    [lvl.HeliumMarker1, lvl.HeliumMarker2].forEach((obj, index) =>
        objHeliumExhaust()
            .step(
                self =>
                    self.isAttackActive = Rpg.quest("GreatTower.EfficientHome.Ringer.ReceivedFish").everCompleted
                        && Rpg.character.status.conditions.helium.ballons.length === index + 1,
                -1,
            )
            .at(obj)
            .show()
    );
}

function enrichRoom0(lvl: LvlType.EfficientHome) {
    const artObj = container()
        .coro(function* (self) {
            while (true) {
                const seed = Rpg.flags.greatTower.efficientHome.artSeed;

                self.removeAllChildren();
                if (seed !== null) {
                    objEsotericArt(seed)
                        .mixin(mxnEsotericArtInteractive)
                        .show(self);
                }
                // TODO types could be improved maybe?
                yield onPrimitiveMutate(() => Rpg.flags.greatTower.efficientHome.artSeed ?? -1);
            }
        })
        .at(lvl.ArtRegion)
        .zIndexed(ZIndex.BackgroundDecals)
        .show();

    lvl.CloudHouseNpc0.mixin(mxnCutscene, function* () {
        yield* ask("You can't tell, but right now I'm working on my art.", "You are?");
        yield* show("Yep, I'm dreaming up big ideas...");
        yield sleep(1000);
        yield* show("Oh! Here's an idea now.");
        yield interpvr(artObj.pivot).factor(factor.sine).translate(0, -280).over(artObj.children.length ? 1000 : 0);
        Rpg.flags.greatTower.efficientHome.artSeed = Rng.intc(0, Math.floor(Number.MAX_SAFE_INTEGER / 2));
        yield interpvr(artObj.pivot).factor(factor.sine).to(0, 0).over(500);
        artObj.pivot.y = 0;
    });
}

function enrichRoom1(lvl: LvlType.EfficientHome) {
    lvl.CloudHouseAddictNpc.mixin(mxnCutscene, function* () {
        yield* show("I love foam insulation!");
        layers.overlay.solidBelowMessages.blendMode = BLEND_MODES.SUBTRACT;
        yield sleep(400);
        yield layers.overlay.solidBelowMessages.fadeIn(500);
        Jukebox.applyGainRamp(Mzk.UnforgivableToner, 0, 1000);
        yield sleep(1000);

        const addictionSfx = Sfx.Character.MarinsAddiction.playInstance();

        const textObjs = container().at(40, 40).show(layers.overlay.messages);

        const textObj0 = objText.Medium(
            `${lvl.CloudHouseAddictNpc.speaker.name} is addicted to eating foam insulation.`,
        )
            .mixin(mxnFxAlphaVisibility, false)
            .show(textObjs);

        textObj0.mxnFxAlphaVisibility.visible = true;

        yield () => addictionSfx.estimatedPlayheadPosition >= 3.18;

        const textObj1 = objText.Medium(
            `Last year, ${lvl.CloudHouseAddictNpc.speaker.name} ate 150,000 gallon-pounts of foam insulation.`,
        )
            .mixin(mxnFxAlphaVisibility, false)
            .at(40, 40)
            .show(textObjs);

        textObj1.mxnFxAlphaVisibility.visible = true;

        yield sleep(3000);

        textObj0.mxnFxAlphaVisibility.visible = false;
        textObj1.mxnFxAlphaVisibility.visible = false;
        Jukebox.applyGainRamp(Mzk.UnforgivableToner, 1, 1000);
        yield sleep(500);

        yield layers.overlay.solidBelowMessages.fadeOut(500);
        textObjs.destroy();
    });
}

function enrichRoom2(lvl: LvlType.EfficientHome) {
    const receivedFishQuest = Rpg.quest("GreatTower.EfficientHome.Ringer.ReceivedFish");
    const ballons = [{ health: 100, healthMax: 100, seed: 0xc01e }];

    let exhaustPrerequisitesMet = receivedFishQuest.everCompleted;

    objHeliumExhaust()
        .step(
            self =>
                self.isAttackActive =
                    (Rpg.character.status.conditions.helium.ballons.length === 0 || ballons.length === 0)
                    && exhaustPrerequisitesMet,
            -1,
        )
        .at(lvl.HeliumMarker0)
        .show();

    [lvl.FishCeilingBlock, lvl.FishWallBlock].forEach(obj => obj.attributes = TerrainAttributes.Decorative);

    objFish.forRinger()
        .at(lvl.FishMarker)
        .zIndexed(ZIndex.FrontDecals)
        .step(self => self.visible = receivedFishQuest.everCompleted)
        .show();

    lvl.CloudHouseRingerNpc
        .handles("mxnSpeaker.speakingStarted", self => self.speed.y = -2)
        .mixin(mxnCutscene, function* () {
            if (!lvl.CloudHouseRingerNpc.speaker.spokeOnceInCurrentScene) {
                yield* show(`DING! It's me, ${lvl.CloudHouseRingerNpc.speaker.name}!`);
            }

            while (true) {
                const playerHasFish = Rpg.inventory.count({ kind: "key_item", id: "RingerFish" }) >= 1;

                const result = yield* ask(
                    "What do you need? DING?",
                    (playerHasFish || receivedFishQuest.everCompleted)
                        ? null
                        : "An errand!",
                    playerHasFish ? "Your fish is here!" : null,
                    receivedFishQuest.everCompleted ? "Secret helium help" : null,
                    "Tell me about yourself",
                    "Nothing",
                );

                if (result === 0) {
                    yield* show("I would love a fish.", "It would really enhance the natural dwelling vibe. DING!");
                    Rpg.flags.greatTower.efficientHome.ringer.toldPlayerAboutDesireForFish = true;
                }
                else if (result === 1) {
                    yield* DramaInventory.removeCount({ kind: "key_item", id: "RingerFish" }, 1);
                    yield* DramaQuests.complete("GreatTower.EfficientHome.Ringer.ReceivedFish");
                    yield* show("Wow! Fantastic!", "What a fish! A damn good fish, indeed!", "DING! DING! DING! DING!");
                    yield sleep(333);
                    yield* show("I will now give you access to a local helium secret.");
                    yield* lvl.CloudHouseRingerNpc.walkTo(lvl.HeliumMarker0.x);
                    lvl.CloudHouseRingerNpc.auto.facing = 1;

                    yield* show("DING! If you visit my apartment without any ballons...");

                    yield interpr(ballons[0], "health").factor(factor.sine).to(0).over(1000);
                    lvl.CloudHouseRingerNpc.mxnBallonable.rpgStatusEffects.ballonHealthDepleted(ballons[0]);
                    ballons.length = 0;
                    exhaustPrerequisitesMet = true;

                    yield sleep(500);
                    yield* show("...Then a helium vein will appear.");

                    yield sleep(500);
                    ballons.push(RpgStatus.createBallon());
                    lvl.CloudHouseRingerNpc.mxnBallonable.rpgStatusEffects.ballonCreated(ballons[0]);
                    yield sleep(500);

                    yield* show("Once you have one ballon, then the vein will disappear.");

                    yield* show(
                        "You can find similar mysteries in apartments 5 and 6.",
                        "Use the dip switches.",
                        "I believe in you. DING!!!",
                    );
                    break;
                }
                else if (result === 2) {
                    yield* show(
                        "My apartment, apartment 2, will reveal a helium spot when you have no ballons. DING!",
                        "Apartment 5 will reveal the spot when you have one ballon.",
                        "Apartment 6 will reveal the spot when you have two ballons.",
                        "This could be useful for repeatedly getting up the great tower. DING! SUCKA!",
                    );
                }
                else if (result === 3) {
                    yield* show("I'm the guardian of the bell. Also I know a secret about helium.", "D-D-D-DING!");
                }
                else {
                    yield* show("I love that! DING!");
                    break;
                }
            }
        })
        .mxnBallonable.setInitialBallons(ballons);
}

function enrichRoom3(lvl: LvlType.EfficientHome) {
    const angryMessages = [
        "Gah! Really?! You walk into places like that?!",
        "What did I say?!",
        "You're tracking dirt everywhere!",
    ];

    objEsotericRemovedShoes().at(lvl.RemovedShoesMarker).show();

    lvl.CloudHouseNeatFreakNpc
        .coro(function* (self) {
            while (true) {
                yield () =>
                    playerObj.x >= lvl.NeatFreakUnsafeRegion.x
                    && playerObj.speed.x > 0
                    && !Rpg.inventory.equipment.loadout.isEmpty
                    && playerObj.collides(lvl.NeatFreakUnsafeRegion);
                yield Cutscene.play(function* () {
                    yield* show(angryMessages.length > 1 ? angryMessages.shift()! : angryMessages[0]);
                    playerObj.speed.y = -2;
                    playerObj.speed.x = -6;
                    yield sleep(500);
                }, { speaker: self }).done;
            }
        })
        .mixin(mxnCutscene, function* () {
            if (!Rpg.inventory.equipment.loadout.isEmpty) {
                return;
            }

            yield* show("Thank you for not wearing your shoes in my apartment.");
            if (!Rpg.quest("GreatTower.EfficientHome.NeatFreak.DidntWearEquipment").everCompleted) {
                yield* DramaQuests.complete("GreatTower.EfficientHome.NeatFreak.DidntWearEquipment");
            }
        });
}
