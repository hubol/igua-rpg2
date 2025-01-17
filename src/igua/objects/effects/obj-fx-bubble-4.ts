import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { interp } from "../../../lib/game-engine/routines/interp";
import { Rng } from "../../../lib/math/rng";
import { scene } from "../../globals";

export function objFxBubble4() {
    return Sprite.from(Tx.Effects.Bubble4).anchored(0.5, 0.5).mixin(mxnBoilMirrorRotate)
        .mixin(mxnPhysics, { physicsRadius: 2, gravity: -0.00625 }).handles("moved", (self, e) => {
            if (e.hitCeiling) {
                self.gravity = 0;
            }
        })
        .step(self => {
            if (self.gravity !== 0) {
                self.speed.x += Math.sin(scene.ticker.ticks * 0.1) * 0.015;
            }
        })
        .coro(function* (self) {
            yield* Coro.race([
                () => self.gravity === 0,
                sleepf(30),
            ]);
            yield interp(self, "alpha").steps(3).to(0).over(Rng.float(500, 1000));
            self.destroy();
        });
}
