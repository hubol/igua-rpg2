import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { DataPotion } from "../data/data-potion";
import { DramaGifts } from "../drama/drama-gifts";
import { show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objCharacterFlower } from "../objects/characters/obj-character-flower";
import { objItemAngelDropperQueue } from "../objects/characters/obj-item-angel-dropper-queue";
import { objBossMusicPlayer } from "../objects/obj-boss-music-player";
import { ObjTerrain } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { RpgGift } from "../rpg/rpg-gifts";

export function scnMountFlopHouseInterior() {
    // TODO should be quest
    const gift = Rpg.gift("MountFlop.Flower");

    const lvl = Lvl.MountFlopHouseInterior();

    objBossMusicPlayer({
        bossObjs: [lvl.EnemySuggestive],
        mzkBattle: Mzk.FuckerLand,
        mzkPeace: Mzk.LingeringStraw,
    })
        .show();

    if (gift.isGiveable()) {
        const pipeObjs = [lvl.Pipe, lvl.Pipe_1];
        const queueObj = objItemAngelDropperQueue().show();

        function pushPotions(...potionIds: DataPotion.Id[]) {
            for (const potionId of potionIds) {
                queueObj.objItemAngelDropperQueue.push(lvl.EnemySuggestive, { kind: "potion", id: potionId });
            }
        }

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
                enrichFlowerNpc(lvl, gift);

                yield () => !gift.isGiveable();

                lvl.Door.objDoor.unlock();
            });
    }
    else {
        lvl.EnemySuggestive.destroy();
        enrichFlowerNpc(lvl, gift);
    }
}

function enrichFlowerNpc(lvl: LvlType.MountFlopHouseInterior, gift: RpgGift) {
    objCharacterFlower()
        .mixin(mxnCutscene, function* () {
            if (!gift.isGiveable()) {
                yield* show("Have you been opening a bunch of flops?");
                return;
            }

            yield* show(
                "Are you a fan of flops?",
                "If so, this will help you open them.",
            );

            yield* DramaGifts.give(gift);
        })
        .at(lvl.NiceGuyMarker)
        .show();
}
