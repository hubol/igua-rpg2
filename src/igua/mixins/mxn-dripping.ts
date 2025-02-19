import { Container, DisplayObject, Point, Rectangle } from "pixi.js";
import { Rng } from "../../lib/math/rng";
import { getRandomDeepChild } from "../lib/get-random-deep-child";
import { objWaterDrip } from "../objects/obj-water-drip-source";
import { mxnDestroyAfterSteps } from "./mxn-destroy-after-steps";
import { mxnPhysics } from "./mxn-physics";

const r = new Rectangle();
const p = new Point();

export function mxnDripping(obj: DisplayObject) {
    const isContainer = obj instanceof Container;

    let dripUnit = 0;

    return obj
        .merge({ dripsPerFrame: 0, dripsTint: 0x68A8D0 })
        .step(self => {
            dripUnit += self.dripsPerFrame;
            while (dripUnit >= 1) {
                const box = isContainer ? getRandomDeepChild(obj) : obj;
                const bounds = box.getBounds(false, r);
                const point = self.getGlobalPosition(p, false);
                const dripObj = objWaterDrip(null)
                    .tinted(self.dripsTint)
                    .mixin(mxnDestroyAfterSteps, 30)
                    .at(point).at(self).add(bounds).add(point, -1).add(Rng.int(bounds.width), 0)
                    .show(self.parent);

                if (obj.is(mxnPhysics)) {
                    dripObj.speed.x = obj.speed.x * 0.1;
                    dripObj.speed.y = obj.speed.y * -0.3;
                }
                dripObj.speed.y += 0.3;
                dripObj.gravity = 0.07;
                dripUnit -= 1;
            }
        });
}
