import { BLEND_MODES, Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Tx } from "../../assets/textures";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnFxTintRotate } from "../mixins/effects/mxn-fx-tint-rotate";
import { mxnBoilTextureIndex } from "../mixins/mxn-boil-texture-index";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../mixins/mxn-enemy-death-burst";
import { mxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFxExpressSurprise } from "../objects/effects/obj-fx-express-surprise";
import { playerObj } from "../objects/obj-player";
import { objIndexedSprite } from "../objects/utils/obj-indexed-sprite";
import { Rpg } from "../rpg/rpg";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgFaction } from "../rpg/rpg-faction";

const ranks = {
    misha: RpgEnemyRank.create({
        status: {
            faction: RpgFaction.Player,
        },
    }),
};

export function scnMishaHouse() {
    scene.camera.framing = "snap_to_renderer_size";
    const computerQuest = Rpg.quest("MishaHouse.DestroyedComputer");
    const waterHeaterQuest = Rpg.quest("MishaHouse.WarmedWaterHeater");
    const lvl = Lvl.MishaHouse();
    Jukebox.play(Mzk.OldSailor);

    lvl.MishaNpc
        .mixin(mxnRpgStatus, { status: ranks.misha.status, hurtboxes: [lvl.MishaNpc] })
        .mixin(mxnCutscene, function* () {
            if (computerQuest.everCompleted) {
                if (waterHeaterQuest.flags.pilotFlameLit && !waterHeaterQuest.everCompleted) {
                    yield* ask("I'm not aware of any problems in production.", "You have hot water now");
                    yield* show("Oh, thank you!!!");
                    yield* lvl.MishaNpc.walkTo(lvl.MishaShowerMarker.x);
                    isShowerRunning = true;
                    yield sleep(1000);
                    lvl.MishaNpc.isDucking = true;
                    yield sleep(1000);
                    yield* show("Good jobber!");
                    yield* DramaQuests.complete(waterHeaterQuest);
                }
                else {
                    yield* show("I'm not aware of any problems in production.");
                }
                return;
            }
            yield* show(
                "I am very sad...",
                "Problems in production...",
            );
        })
        .coro(function* (self) {
            yield () => computerQuest.everCompleted;
            self.head.mouth.emote.happy();
        });

    lvl.Dummy.mixin(mxnFxTintRotate);

    [
        lvl.StringLights,
        lvl.Lights,
    ]
        .forEach(obj => obj.step(() => obj.tint = lvl.Dummy.tint));

    lvl.Lights.alpha = 0.5;
    lvl.Lights.blendMode = BLEND_MODES.ADD;

    lvl.Door.objDoor.openTint = 0x000000;

    let isShowerRunning = false;

    if (waterHeaterQuest.everCompleted) {
        isShowerRunning = true;
        lvl.MishaNpc.at(lvl.MishaShowerMarker);
        lvl.MishaNpc.auto.setFacingImmediately(-1);
        lvl.MishaNpc.isDucking = true;
        lvl.MishaNpc.ducking = 1;
    }

    scene.stage
        .coro(function* () {
            const dripSourceObjs = [lvl.WaterDripSource0, lvl.WaterDripSource1, lvl.WaterDripSource2];
            while (true) {
                yield () => isShowerRunning;

                // TODO sfx
                for (const obj of dripSourceObjs) {
                    obj.objWaterDripSource.delayMin = 100;
                    obj.objWaterDripSource.delayMax = 300;
                    yield sleepf(3);
                }

                yield () => !isShowerRunning;

                for (const obj of dripSourceObjs.reverse()) {
                    obj.objWaterDripSource.delayMin = Number.MAX_SAFE_INTEGER;
                    obj.objWaterDripSource.delayMax = Number.MAX_SAFE_INTEGER;
                    yield sleepf(3);
                }
            }
        });

    lvl.ShowerLeverRegion
        .mixin(mxnCutscene, function* () {
            const wasShowerRunning = isShowerRunning;

            if (!wasShowerRunning) {
                isShowerRunning = true;
                yield sleep(2000);
            }

            Cutscene.setCurrentSpeaker(playerObj);
            yield* show(
                waterHeaterQuest.flags.pilotFlameLit
                    ? "Perfect temperature."
                    : "The water is extremely cold.",
            );

            isShowerRunning = wasShowerRunning;
        });

    enrichWaterHeater(lvl);

    lvl.Calendar
        .mixin(mxnSpeaker, { name: "Misha's Calendar", tintPrimary: 0x848AE0, tintSecondary: 0x2E0D33 })
        .mixin(mxnCutscene, function* () {
            yield* show(
                "Seven Days Ago ... Work",
                "Six Days Ago ... Work",
                "Five Days Ago ... Work",
                "Four Days Ago ... Work",
                "Three Days Ago ... Work",
                "Two Days Ago ... Work",
                "Yesterday ... Work",
                "Today ...",
            );

            objFxExpressSurprise()
                .at(playerObj.head.getWorldCenter())
                .show();

            playerObj.speed.y = -2;
            yield sleep(500);
            yield* show("Today ... Birthday");

            yield sleep(1000);

            Cutscene.setCurrentSpeaker(playerObj);
            yield* show("Oh... I wonder how I could surprise Misha for his birthday.");

            Rpg.quest("MishaHouse.Birthday").flags.readCalendar = true;
        });

    if (computerQuest.everCompleted) {
        return;
    }

    objMishaComputer()
        .at(lvl.ComputerMarker)
        .zIndexed(ZIndex.Entities)
        .handles("mxnEnemy.died", () =>
            Cutscene.play(function* () {
                yield () => playerObj.isOnGround;

                yield* show(
                    "Well...",
                    "I think that helps.",
                );

                yield* DramaQuests.complete(computerQuest);
            }, { speaker: lvl.MishaNpc }))
        .show();
}

function enrichWaterHeater(lvl: LvlType.MishaHouse) {
    const quest = Rpg.quest("MishaHouse.WarmedWaterHeater");

    const rank = RpgEnemyRank.create({
        status: {
            health: quest.flags.pilotFlameLit ? undefined : 50,
            healthMax: 130,
            defenses: {
                physical: 100,
                overheat: -100,
            },
        },
    });

    lvl.WaterHeater
        .mixin(mxnEnemy, { rank, hurtboxes: [lvl.WaterHeaterRegion] })
        .mixin(mxnSpeaker, { name: "Water Heater", tintPrimary: 0xC46729, tintSecondary: 0x999999 })
        .coro(function* (self) {
            if (quest.flags.pilotFlameLit) {
                return;
            }

            yield () => self.status.health >= self.status.healthMax;

            quest.flags.pilotFlameLit = true;
            Cutscene.play(function* () {
                yield* show("Pilot flame restored.");
            }, { speaker: self });
        });
}

const [txComputer, ...txsComputerLayers] = Tx.Esoteric.MishaComputer.Layers.split({ count: 3 });

const rankComputer = RpgEnemyRank.create({
    status: {
        health: 20,
        defenses: {
            physical: 80,
        },
    },
});

function objMishaComputer() {
    const computerObj = Sprite.from(txComputer);
    return container(
        computerObj,
        objIndexedSprite(txsComputerLayers)
            .mixin(mxnBoilTextureIndex)
            .mixin(mxnFxTintRotate),
    )
        .pivoted(29, 30)
        .mixin(mxnEnemy, { hurtboxes: [computerObj], rank: rankComputer })
        .mixin(mxnEnemyDeathBurst, { map: [0x808080, 0x505050, 0xa0a0a0] });
}
