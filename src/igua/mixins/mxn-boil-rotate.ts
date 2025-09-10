import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";

export function mxnBoilRotate(obj: DisplayObject) {
    return obj.coro(function* () {
        const offset = vnew();

        while (true) {
            obj.angle = Rng.float() < 0.15 ? 0 : Rng.float(-0.75, 0.75);
            obj.pivot.add(offset, -1);
            offset.at(Rng.intc(-1, 1), Rng.intc(-1, 1));
            obj.pivot.add(offset);
            yield sleep(Rng.int(350, 500));
        }
    });
}
