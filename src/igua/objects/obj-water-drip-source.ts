import { Sprite } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Tx } from "../../assets/textures";
import { mxnPhysics } from "../mixins/mxn-physics";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { Rng } from "../../lib/math/rng";

interface ObjWaterDripSourceArgs {
    delayMin: number;
    delayMax: number;
}

export function objWaterDripSource({ delayMin, delayMax }: ObjWaterDripSourceArgs) {
    return container()
        .async(async self => {
            while (true) {
                await sleep(Rng.intc(delayMin, delayMax));
                objWaterDrip().at(self).show(self.parent);
            }
        })
}

function objWaterDrip() {
    const obj = Sprite.from(Tx.Effects.WaterDripSmall)
        .mixin(mxnPhysics, { gravity: 0.05, physicsRadius: 4, physicsOffset: [0, -2], onMove: (ev) => {
            if (ev.hitGround) {
                obj.destroy();
                // TODO drip sfx
            }
        } });

    return obj;
}