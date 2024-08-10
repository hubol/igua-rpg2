import { Sprite } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Tx } from "../../assets/textures";
import { mxnPhysics } from "../mixins/mxn-physics";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { Rng } from "../../lib/math/rng";
import { Instances } from "../../lib/game-engine/instances";
import { mxnRpgStatus } from "../mixins/mxn-rpg-status";

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

function objWaterDrip(poison: boolean) {
    const obj = Sprite.from(poison ? Tx.Effects.PoisonDripSmall : Tx.Effects.WaterDripSmall)
        .mixin(mxnPhysics, { gravity: 0.05, physicsRadius: 4, physicsOffset: [0, -2], onMove: (ev) => {
            if (poison) {
                // TODO should be a more terse way to accomplish this!
                for (const instance of Instances(mxnRpgStatus)) {
                    if (obj.collidesOne(instance.hurtboxes)) {
                        instance.poison(5);
                        // TODO sfx
                        return obj.destroy();
                    }       
                }
            }
            if (ev.hitGround) {
                obj.destroy();
                // TODO drip sfx
            }
        } });

    return obj;
}