import { DisplayObject, Rectangle } from "pixi.js";
import { IRectangle } from "../../lib/math/rectangle";
import { vnew } from "../../lib/math/vector-type";
import { renderer } from "../current-pixi-renderer";

const cameraBounds = new Rectangle(0, 0, renderer.width, renderer.height);
const origin = vnew(renderer.width / 2, renderer.height / 2).vround();
const r = new Rectangle();

export function mxnMoveIntoCamera(obj: DisplayObject, speed = 1) {
    return obj
        .step(() => {
            if (!IRectangle.isEnveloped(cameraBounds, obj.getBounds(false, r))) {
                obj.moveTowards(origin, speed);
            }
        });
}
