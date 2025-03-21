import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";

export function mxnBoilSeed(obj: DisplayObject & { seed: number }, delay = 200) {
    return obj.coro(function* () {
        while (true) {
            obj.seed = Rng.int(8_000_000, 16_000_000);
            yield sleep(delay);
        }
    });
}
