import { DisplayObject } from "pixi.js";
import { vnew } from "../../lib/math/vector-type";

export function mxnMotion(obj: DisplayObject) {
    return obj.merge({ speed: vnew() }).step(self => self.add(self.speed));
}
