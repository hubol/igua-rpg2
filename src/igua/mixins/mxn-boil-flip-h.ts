import { Container } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";

export function mxnBoilFlipH(obj: Container) {
    return obj.coro(function* () {
        let h = Rng.intp();
        obj.flipH(h);

        while (true) {
            yield sleep(Rng.intc(400, 800));
            h *= -1;
            obj.flipH(h);
        }
    });
}
