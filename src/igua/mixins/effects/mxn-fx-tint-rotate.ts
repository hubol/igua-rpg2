import { ColorSource, DisplayObject } from "pixi.js";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";

export function mxnFxTintRotate(spr: DisplayObject & { tint: ColorSource }) {
    return spr.coro(function* (self) {
        const angle = Rng.int(0, 360);

        while (true) {
            for (let i = 0; i < 360; i += 30) {
                self.tint = AdjustColor.hsv((angle + i) % 360, 100, 100).toPixi();
                yield sleepf(10);
            }
        }
    });
}
