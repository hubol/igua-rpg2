import { DisplayObject } from "pixi.js";
import { vnew } from "../../../lib/math/vector-type";

export function mxnFxVibrate(obj: DisplayObject, target: "position" | "pivot" = "pivot") {
    let vibrate = 0;

    const api = {
        frequency: 0,
        direction: vnew(0, -1),
    };

    const scalar = target === "pivot" ? -1 : 1;

    return obj
        .merge({ mxnFxVibrate: api })
        .step(() => {
            if (api.frequency === 0) {
                vibrate = 0;
                return;
            }

            vibrate += api.frequency;
            if (vibrate >= 1) {
                vibrate %= 1;
                const vector = obj[target];
                if (vector.isZero) {
                    vector.at(api.direction, scalar);
                }
                else {
                    vector.at(0, 0);
                }
            }
        });
}
