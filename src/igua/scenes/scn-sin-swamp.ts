import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { range } from "../../lib/range";
import { DataPotion } from "../data/data-potion";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";

export function scnSinSwamp() {
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
    lvl.PoisonRegion.mixin(mxnRpgAttack, { attack: atkPoison });
    const potionIds: DataPotion.Id[] = range(8).map(() => "PoisonRestore");
    Instances(mxnEnemy).forEach(obj => obj.mxnRpgStatusPotions.heldPotionIds.push(...potionIds));
}
