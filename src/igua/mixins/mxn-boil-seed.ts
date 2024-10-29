import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";

export function mxnBoilSeed(obj: DisplayObject & { seed: number }) {
    return obj.coro(function* () {
        while (true) {
            obj.seed = Rng.int(10000);
            yield sleep(200);
        }
    });
}
