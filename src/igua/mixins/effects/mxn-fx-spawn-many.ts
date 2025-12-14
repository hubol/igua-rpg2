import { Container, DisplayObject, Point, Rectangle } from "pixi.js";
import { Rng } from "../../../lib/math/rng";
import { getRandomDeepChild } from "../../lib/get-random-deep-child";

interface MxnFxSpawnManyArgs {
    readonly perFrame: number;
    spawnObj: () => DisplayObject;
}

const r = new Rectangle();
const p = new Point();

export function mxnFxSpawnMany(obj: DisplayObject, args: MxnFxSpawnManyArgs) {
    const isContainer = obj instanceof Container;

    let unit = 0;

    return obj
        .step(self => {
            unit += args.perFrame;
            while (unit >= 1) {
                const box = isContainer ? getRandomDeepChild(obj) : obj;
                const bounds = box.getBounds(false, r);

                if (bounds.x === 0 && bounds.y === 0 && bounds.width === 0 && bounds.height === 0) {
                    p.at(self).add(Rng.intc(-2, 2), Rng.intc(-2, 2));
                }
                else {
                    p.at(bounds).add(Rng.int(bounds.width), Rng.int(bounds.height));
                    self.parent.transform.worldTransform.applyInverse(p, p);
                }

                args.spawnObj()
                    .at(p)
                    .show(self.parent);

                unit -= 1;
            }
        });
}
