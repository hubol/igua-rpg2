import { BLEND_MODES, Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnFxTintRotate } from "../mixins/effects/mxn-fx-tint-rotate";
import { mxnBoilTextureIndex } from "../mixins/mxn-boil-texture-index";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../mixins/mxn-enemy-death-burst";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { objIndexedSprite } from "../objects/utils/obj-indexed-sprite";
import { Rpg } from "../rpg/rpg";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";

export function scnMishaHouse() {
    scene.camera.framing = "snap_to_renderer_size";
    const computerQuest = Rpg.quest("MishaHouse.DestroyedComputer");
    const lvl = Lvl.MishaHouse();

    lvl.MishaNpc
        .mixin(mxnCutscene, function* () {
            if (computerQuest.everCompleted) {
                yield* show("I'm not aware of any problems in production.");
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

    lvl.ShowerLeverRegion
        .mixin(mxnCutscene, function* () {
            yield () => playerObj.isOnGround;
            const dripSourceObjs = [lvl.WaterDripSource0, lvl.WaterDripSource1, lvl.WaterDripSource2];

            // TODO sfx
            for (const obj of dripSourceObjs) {
                obj.objWaterDripSource.delayMin = 100;
                obj.objWaterDripSource.delayMax = 300;
                yield sleepf(3);
            }

            yield sleep(2000);

            Cutscene.setCurrentSpeaker(playerObj);
            yield* show(
                Rpg.flags.misha.waterHeater.warmed
                    ? "Perfect temperature."
                    : "The water is extremely cold.",
            );

            for (const obj of dripSourceObjs.reverse()) {
                obj.objWaterDripSource.delayMin = Number.MAX_SAFE_INTEGER;
                obj.objWaterDripSource.delayMax = Number.MAX_SAFE_INTEGER;
                yield sleepf(3);
            }
        });

    enrichWaterHeater(lvl);

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

                yield* DramaQuests.complete("MishaHouse.DestroyedComputer");
            }, { speaker: lvl.MishaNpc }))
        .show();
}

function enrichWaterHeater(lvl: LvlType.MishaHouse) {
    const rank = RpgEnemyRank.create({
        status: {
            health: Rpg.flags.misha.waterHeater.warmed ? undefined : 50,
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
            if (Rpg.flags.misha.waterHeater.warmed) {
                return;
            }

            yield () => self.status.health >= self.status.healthMax;

            Rpg.flags.misha.waterHeater.warmed = true;
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
