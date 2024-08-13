import { Sprite } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Tx } from "../../assets/textures";
import { mxnPhysics } from "../mixins/mxn-physics";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { Rng } from "../../lib/math/rng";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";
import { mxnProjectile } from "../mixins/mxn-projectile";

interface ObjWaterDripSourceArgs {
    delayMin: number;
    delayMax: number;
}

export function objWaterDripSource({ delayMin, delayMax }: ObjWaterDripSourceArgs) {
    return container()
        .track(objWaterDripSource)
        .merge({ poison: false })
        .async(async self => {
            while (true) {
                await sleep(Rng.intc(delayMin, delayMax));
                objWaterDrip(self.poison).at(self).show(self.parent);
            }
        })
}

const atkPoisonDrip = RpgAttack.create({
    poison: 5,
    versus: RpgFaction.Anyone,
});

function objWaterDrip(poison: boolean) {
    const obj = Sprite.from(poison ? Tx.Effects.PoisonDripSmall : Tx.Effects.WaterDripSmall)
        .mixin(mxnPhysics, { gravity: 0.05, physicsRadius: 4, physicsOffset: [0, -2], onMove: (ev) => {
            if (ev.hitGround) {
                obj.destroy();
                // TODO drip sfx
            }
        } })
        .mixin(mxnProjectile, { attack: atkPoisonDrip })
        .handles('hit', self => self.destroy());

    return obj;
}