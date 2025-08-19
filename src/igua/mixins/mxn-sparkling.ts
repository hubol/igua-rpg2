import { Container, DisplayObject, Point, Rectangle } from "pixi.js";
import { Rng } from "../../lib/math/rng";
import { getRandomDeepChild } from "../lib/get-random-deep-child";
import { objValuableSparkle } from "../objects/effects/obj-valuable-sparkle";

const r = new Rectangle();
const p = new Point();

// TODO kind of copy-pasted from mxnDripping
// Probably could have some kind of abstraction
export function mxnSparkling(obj: DisplayObject) {
    const isContainer = obj instanceof Container;

    let sparkleUnit = 0;

    return obj
        .merge({ sparklesPerFrame: 0, sparklesTint: 0xffffff })
        .step(self => {
            sparkleUnit += self.sparklesPerFrame;
            while (sparkleUnit >= 1) {
                const box = isContainer ? getRandomDeepChild(obj) : obj;
                const bounds = box.getBounds(false, r);
                const point = self.getGlobalPosition(p, false);
                objValuableSparkle()
                    .tinted(self.sparklesTint)
                    .at(point).at(self).add(bounds).add(point, -1).add(Rng.int(bounds.width), Rng.int(bounds.height))
                    .show(self.parent);

                sparkleUnit -= 1;
            }
        });
}
