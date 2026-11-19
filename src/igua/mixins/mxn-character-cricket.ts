import { DisplayObject } from "pixi.js";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { DramaLib } from "../drama/drama-lib";
import { mxnSpeaker } from "./mxn-speaker";

export function mxnCharacterCricket(obj: DisplayObject) {
    return obj
        .mixin(mxnSpeaker, { name: "Cricket", tintPrimary: 0x4b3413, tintSecondary: 0x5c5037 })
        .coro(function* (self) {
            const max = self.x;
            const min = self.x - 32;
            while (true) {
                yield sleep(Rng.int(300, 1000));
                if (DramaLib.Speaker.current === obj) {
                    continue;
                }
                const x = Rng.intc(min, max);
                const scale = Math.sign(x - self.x);
                if (scale !== 0) {
                    self.scale.x = scale;
                }
                yield interpvr(self)
                    .factor(factor.sine)
                    .to(x, self.y)
                    .over(Rng.int(300, 500));
            }
        });
}
