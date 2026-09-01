import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";

export function mxnTinyBoilPivot(obj: DisplayObject, axis: "x" | "y") {
    return obj
        .coro(function* () {
            while (true) {
                yield sleep(Rng.intc(333, 500));
                let dir = Rng.intp();
                obj.pivot[axis] = Math.max(-1, Math.min(1, obj.pivot[axis] + dir));
            }
        });
}
