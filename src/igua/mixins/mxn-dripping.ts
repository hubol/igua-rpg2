import { Container, DisplayObject, Point, Rectangle } from "pixi.js";
import { Rng } from "../../lib/math/rng";
import { objWaterDrip } from "../objects/obj-water-drip-source";
import { mxnDestroyAfterSteps } from "./mxn-destroy-after-steps";
import { mxnPhysics } from "./mxn-physics";

const r = new Rectangle();
const p = new Point();

export function mxnDripping(obj: DisplayObject) {
    const isContainer = obj instanceof Container;

    let dripUnit = 0;

    return obj
        .merge({ dripsPerFrame: 0 })
        .step(self => {
            dripUnit += self.dripsPerFrame;
            while (dripUnit >= 1) {
                const box = isContainer ? getRandomDeepChild(obj) : obj;
                const bounds = box.getBounds(false, r);
                const point = self.getGlobalPosition(p, false);
                const dripObj = objWaterDrip(null)
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

function getRandomDeepChild(obj: Container) {
    if (!obj.children.length) {
        return obj;
    }

    loop: while (true) {
        const length = obj.children.length;
        let index = Rng.int(length);
        for (let i = 0; i < length; i++) {
            const obj2 = obj.children[(index + i) % length];
            if (!obj2.visible) {
                continue;
            }
            if (!obj2.children?.length) {
                return obj;
            }
            obj = obj2 as Container;
            continue loop;
        }

        return obj;
    }
}
