import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { DramaGifts } from "../drama/drama-gifts";
import { show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objCharacterFlower } from "../objects/characters/obj-character-flower";
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

        scene.stage
            .coro(function* () {
                yield () => lvl.EnemySuggestive.mxnDetectPlayer.isDetected;

                pipeObjs.forEach(ObjTerrain.toggle);

                yield () => lvl.EnemySuggestive.status.health < lvl.EnemySuggestive.status.healthMax * 0.9;

                lvl.EnemySuggestive.mxnRpgStatusPotions.heldPotionIds.push("AttributeStrengthUp");
                lvl.EnemySuggestive.mxnRpgStatusPotions.heldPotionIds.push("RestoreHealth");

                yield () => lvl.EnemySuggestive.status.health < lvl.EnemySuggestive.status.healthMax * 0.5;

                lvl.EnemySuggestive.mxnRpgStatusPotions.heldPotionIds.push("RestoreHealth");

                yield () => lvl.EnemySuggestive.destroyed;

                pipeObjs.forEach(ObjTerrain.toggle);
                enrichFlowerNpc(lvl, gift);
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
