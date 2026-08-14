import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { ZIndex } from "../core/scene/z-index";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objCharacterFlower } from "../objects/characters/obj-character-flower";
import { objItemAngelDropperQueue } from "../objects/characters/obj-item-angel-dropper-queue";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";
import { objBossMusicPlayer } from "../objects/obj-boss-music-player";
import { CtxTerrainPipe, ObjTerrain } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { RpgQuest } from "../rpg/rpg-quests";

export function scnMountFlopHouseInterior() {
    const quest = Rpg.quest("MountFlop.Flower");

    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Grate;
    const lvl = Lvl.MountFlopHouseInterior();

    objBossMusicPlayer({
        bossObjs: [lvl.EnemySuggestive],
        mzkBattle: Mzk.FuckerLand,
        mzkPeace: Mzk.LingeringStraw,
    })
        .show();

    const flopDexNumbers = [233, 528, 833];
    const flopMessages = [
        [
            "The wizard is forever looking to the past.",
            "Attempting to recreate whatever pathetic, convenient memory of that time remains.",
        ],
        [
            "Perhaps the wizard is acting out of generations-long grief. After all, his companions were slain.",
            "His cohorts were all masters of their elements. But he is not.",
        ],
        [
            "At the depth of his hubris, he separated himself into the homunculi.",
            "And they will also never master the elements. They are doomed to flounder in disfigured mediocrity.",
        ],
    ];

    [lvl.FlopMarker0, lvl.FlopMarker1, lvl.FlopMarker2]
        .forEach((position, i) => {
            const flopObj = objFigureFlop.objFiltered(flopDexNumbers[i]);
            flopObj
                .mixin(mxnSpeaker, {
                    name: "Flop Poster",
                    tintPrimary: flopObj.state.tint.red,
                    tintSecondary: flopObj.state.tint.green,
                })
                .mixin(mxnCutscene, function* () {
                    yield* show(
                        "A poster of a beloved Flop.",
                        "A message is printed here:",
                        ...flopMessages[i],
                    );
                })
                .step(self => self.interact.enabled = !quest.isCompletable)
                .at(position)
                .zIndexed(ZIndex.BackgroundDecals)
                .show();
        });

    if (quest.isCompletable) {
        lvl.EnemySuggestive.mxnDetectPlayer.defaultRayDistance = 500;

        const pipeObjs = [lvl.Pipe, lvl.Pipe_1];
        const pushPotions = objItemAngelDropperQueue()
            .show()
            .objItemAngelDropperQueue.createPushPotions(lvl.EnemySuggestive);

        scene.stage
            .coro(function* () {
                yield () => lvl.EnemySuggestive.mxnDetectPlayer.isDetected;

                pipeObjs.forEach(ObjTerrain.toggle);

                yield () => lvl.EnemySuggestive.status.health < lvl.EnemySuggestive.status.healthMax * 0.9;

                pushPotions("RestoreHealth", "RestoreHealth");

                yield () => lvl.EnemySuggestive.status.health < lvl.EnemySuggestive.status.healthMax * 0.5;

                pushPotions("RestoreHealth", "AttributeStrengthUp", "RestoreHealth");

                yield () => lvl.EnemySuggestive.status.health < lvl.EnemySuggestive.status.healthMax * 0.3;

                pushPotions("RestoreHealth", "RestoreHealth");

                yield () => lvl.EnemySuggestive.destroyed;

                lvl.Door.objDoor.lock();
                pipeObjs.forEach(ObjTerrain.toggle);
                enrichFlowerNpc(lvl, quest);

                yield () => !quest.isCompletable;

                lvl.Door.objDoor.unlock();
            });
    }
    else {
        lvl.EnemySuggestive.destroy();
        enrichFlowerNpc(lvl, quest);
    }
}

function enrichFlowerNpc(lvl: LvlType.MountFlopHouseInterior, quest: RpgQuest) {
    objCharacterFlower()
        .mixin(mxnCutscene, function* () {
            if (!quest.isCompletable) {
                yield* show("Have you been opening a bunch of flops?");
                return;
            }

            yield* show(
                "Are you a fan of flops?",
                "If so, this will help you open them.",
            );

            yield* DramaQuests.complete(quest);
        })
        .at(lvl.NiceGuyMarker)
        .show();
}
