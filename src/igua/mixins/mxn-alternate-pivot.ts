import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";

export function mxnAlternatePivot(obj: DisplayObject) {
    return obj.coro(function* () {
        while (true) {
            obj.pivot.y = obj.pivot.y ? 0 : 1;
            yield sleep(750);
        }
    });
}
