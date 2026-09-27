import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { range } from "../../lib/range";
import { Jukebox } from "../core/igua-audio";
import { DataPotion } from "../data/data-potion";
import { mxnFxSpawnMany } from "../mixins/effects/mxn-fx-spawn-many";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { objFxPoisonCloud } from "../objects/effects/obj-fx-poison-cloud";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";

export function scnSinSwamp() {
    Jukebox.play(Mzk.SporadicQuest).warm(Mzk.BestSeller);
    const lvl = Lvl.SinSwamp();
    enrichPoison(lvl);
}

const atkPoison = RpgAttack.create({
    conditions: {
        poison: {
            value: 1,
        },
    },
    versus: RpgFaction.Anyone,
});

function enrichPoison(lvl: LvlType.SinSwamp) {
    lvl.PoisonRegion
        .mixin(mxnRpgAttack, { attack: atkPoison })
        .mixin(mxnFxSpawnMany, { perFrame: 1, spawnObj: objFxPoisonCloud });
    const potionIds: DataPotion.Id[] = range(8).map(() => "PoisonRestore");
    Instances(mxnEnemy).forEach(obj => obj.mxnRpgStatusPotions.heldPotionIds.push(...potionIds));
}
