import { DisplayObject } from "pixi.js";
import { vnew } from "../../lib/math/vector-type";

export function mxnStartPosition(obj: DisplayObject) {
    return obj
        .merge({ startPosition: vnew() })
        .coro(function* (self) {
            self.startPosition.at(self);
        });
}
