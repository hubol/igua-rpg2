import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";

export function mxnBoilPivot(obj: DisplayObject) {
    return obj.coro(function* () {
        while (true) {
            obj.pivot.at(Rng.intc(-1, 1), Rng.intc(-1, 1));
            yield sleep(Rng.int(100, 500));
        }
    });
}
