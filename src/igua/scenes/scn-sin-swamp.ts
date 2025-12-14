import { Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { range } from "../../lib/range";
import { ZIndex } from "../core/scene/z-index";
import { DataPotion } from "../data/data-potion";
import { mxnFxSpawnMany } from "../mixins/effects/mxn-fx-spawn-many";
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
    lvl.PoisonRegion
        .mixin(mxnRpgAttack, { attack: atkPoison })
        .mixin(mxnFxSpawnMany, { perFrame: 1, spawnObj: objPoisonCloud });
    const potionIds: DataPotion.Id[] = range(8).map(() => "PoisonRestore");
    Instances(mxnEnemy).forEach(obj => obj.mxnRpgStatusPotions.heldPotionIds.push(...potionIds));
}

function objPoisonCloud() {
    const sprite = Sprite.from(Rng.choose(Tx.Effects.PoisonCloud0, Tx.Effects.PoisonCloud1));
    sprite.alpha = 0;

    return sprite
        .anchored(0.5, 0.5)
        .coro(function* () {
            const total = Rng.intc(2000, 4000);
            yield* Coro.all([
                Coro.chain([
                    interp(sprite, "alpha").steps(4).to(1).over(total / 4),
                    sleep(total / 2),
                    interp(sprite, "alpha").steps(4).to(0).over(total / 4),
                ]),
                interpvr(sprite).factor(factor.sine).translate(Rng.vunit().scale(8).vround()).over(total),
            ]);
            sprite.destroy();
        })
        .angled(Rng.int(1) * 180)
        .scaled(Rng.intp(), Rng.intp())
        .tinted(Rng.choose(0x707e25, 0x466b1c))
        .zIndexed(ZIndex.TerrainDecals);
}
