import { DisplayObject } from "pixi.js";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { vnew } from "../../lib/math/vector-type";

export function mxnErrorVibrate(obj: DisplayObject) {
    let vibrateIterationsCount = 0;

    const methods = {
        vibrate() {
            vibrateIterationsCount = 4;
        },
    };

    const v = vnew();

    return obj
        .merge({ mxnErrorVibrate: { methods } })
        .coro(function* (self) {
            while (true) {
                yield () => vibrateIterationsCount > 0;
                v.at(self.pivot);

                while (vibrateIterationsCount > 0) {
                    self.pivot.at(v).add(-2, 0);
                    yield sleepf(4);
                    self.pivot.at(v);
                    yield sleepf(3);
                    vibrateIterationsCount--;
                }

                self.pivot.at(v);
            }
        });
}
