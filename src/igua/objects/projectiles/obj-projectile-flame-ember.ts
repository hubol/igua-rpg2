import { DisplayObject, Graphics, LineStyle } from "pixi.js";
import { blendColor } from "../../../lib/color/blend-color";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { mxnSparkling } from "../../mixins/mxn-sparkling";

export function objProjectileFlameEmber(targetObj: DisplayObject) {
    const collisionObj = new Graphics()
        .lineStyle(1, 0x800000)
        .drawRect(-4, -4, 8, 8);

    const api = {
        speed: 0,
    };

    return container(
        collisionObj,
    )
        .merge({ objProjectileFlameEmber: api })
        .collisionShape(CollisionShape.DisplayObjects, [collisionObj])
        .mixin(mxnSparkling)
        .step(self => {
            collisionObj.angle = Rng.int(2) * 45;
            self.sparklesPerFrame = 1;
            self.sparklesTint = blendColor(0xa31b1b, 0xffd900, Rng.float());

            if (targetObj.destroyed) {
                self.destroy();
                return;
            }

            self.moveTowards(targetObj, api.speed);
        });
}
