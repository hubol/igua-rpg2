import { DisplayObject } from "pixi.js";
import { sleepf } from "../../lib/game-engine/routines/sleep";

export function mxnNudgeAppear(obj: DisplayObject) {
    return obj.coro(function* (self) {
        self.y += 2;
        yield sleepf(3);
        self.y -= 2;
    });
}
