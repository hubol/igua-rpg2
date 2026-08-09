import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objCharacterFlower } from "../objects/characters/obj-character-flower";
import { objItemAngelDropperQueue } from "../objects/characters/obj-item-angel-dropper-queue";
import { objBossMusicPlayer } from "../objects/obj-boss-music-player";
import { ObjTerrain } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { RpgQuest } from "../rpg/rpg-quests";

export function scnMountFlopHouseInterior() {
    // TODO should be quest
    const quest = Rpg.quest("MountFlop.Flower");

    const lvl = Lvl.MountFlopHouseInterior();

    objBossMusicPlayer({
        bossObjs: [lvl.EnemySuggestive],
        mzkBattle: Mzk.FuckerLand,
        mzkPeace: Mzk.LingeringStraw,
    })
        .show();

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
