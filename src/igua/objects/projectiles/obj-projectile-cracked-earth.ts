import { Graphics } from "pixi.js";
import { blendColor } from "../../../lib/color/blend-color";
import { interpc } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { ZIndex } from "../../core/scene/z-index";
import { objFxCrackedEarth } from "../effects/obj-fx-cracked-earth";

export function objProjectileCrackedEarth(width: Integer) {
    const fxCrackedEarthObj = objFxCrackedEarth(width)
        .coro(function* (self) {
            // TODO should respect attackObj isActive
            while (true) {
                yield sleep(Rng.int(100, 150));
                yield interpc(self.objFxCrackedEarth, "tint")
                    .steps(3)
                    .to(getCrackedEarthTint(Rng.float(0.4)))
                    .over(Rng.int(200, 300));
                yield sleep(Rng.int(100, 150));
                yield interpc(self.objFxCrackedEarth, "tint")
                    .steps(3)
                    .to(getCrackedEarthTint(Rng.float(0.6, 1)))
                    .over(Rng.int(200, 300));
            }
        });
    fxCrackedEarthObj.objFxCrackedEarth.tint = getCrackedEarthTint(Rng.float());

    const attackObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, -12, 1, 12)
        .invisible()
        .step(self => self.scale.x = fxCrackedEarthObj.objFxCrackedEarth.width)
        .show(fxCrackedEarthObj);

    return fxCrackedEarthObj
        .zIndexed(ZIndex.TerrainEntities)
        .collisionShape(CollisionShape.DisplayObjects, [attackObj]);
}

function getCrackedEarthTint(blend: number) {
    return blendColor(0x6e1b0d, 0xffd900, blend);
}
