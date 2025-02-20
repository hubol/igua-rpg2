import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";

export function mxnBoilMirrorRotate(obj: DisplayObject, rate = 1) {
    return obj.coro(function* (self) {
        while (true) {
            self.scale.x = Rng.intp();
            self.scale.y = Rng.intp();
            self.angle = Rng.int(2) * 180;
            yield sleep(Rng.float(250, 333) * rate);
        }
    });
}
