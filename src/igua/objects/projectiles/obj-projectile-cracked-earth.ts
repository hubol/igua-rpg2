import { Graphics } from "pixi.js";
import { blendColor } from "../../../lib/color/blend-color";
import { interpc } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { ZIndex } from "../../core/scene/z-index";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { objFxCrackedEarth } from "../effects/obj-fx-cracked-earth";

export function objProjectileCrackedEarth(width: Integer, attack: RpgAttack.Model) {
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
        .mixin(mxnRpgAttack, { attack })
        .step(self => self.scale.x = fxCrackedEarthObj.objFxCrackedEarth.width)
        .show(fxCrackedEarthObj);

    return fxCrackedEarthObj
        .zIndexed(ZIndex.TerrainEntities)
        .merge({ objProjectileCrackedEarth: { attackObj } });
}

function getCrackedEarthTint(blend: number) {
    return blendColor(0x6e1b0d, 0xffd900, blend);
}
