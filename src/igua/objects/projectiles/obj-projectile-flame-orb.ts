import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { objFxFizzle } from "../effects/obj-fx-fizzle";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const orbTxs = Tx.Enemy.Miffed.SweepOrb.split({ width: 16 });

export function objProjectileFlameOrb(tint: RgbInt, fizzleTint: RgbInt) {
    const sprite = objIndexedSprite(orbTxs).anchored(0.5, 0.5).at(0, 8).tinted(tint);
    return container(sprite)
        .pivoted(0, 8)
        .mixin(mxnPhysics, { physicsRadius: 8, gravity: 0.2, physicsOffset: [0, -8] })
        .mixin(mxnDestroyAfterSteps, 120)
        .handles("moved", (self, event) => {
            if (event.hitGround) {
                objFxFizzle().tinted(fizzleTint).at(self).show();
                self.destroy();
            }
        })
        .coro(function* (self) {
            sprite.scale.x = Math.sign(self.speed.x) || 1;
            yield interp(sprite, "textureIndex").to(sprite.textures.length).over(Rng.int(100, 200));
            yield sleepf(5);
            while (true) {
                sprite.angle += 90;
                yield sleepf(5);
            }
        });
}
