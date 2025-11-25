import { DisplayObject } from "pixi.js";
import { approachLinear } from "../../../lib/math/number";

export function mxnFxAlphaVisibility(obj: DisplayObject, visible = true) {
    const mxnFxAlphaVisibility = {
        visible,
    };

    obj.alpha = visible ? 1 : 0;

    return obj
        .merge({ mxnFxAlphaVisibility })
        .step(self => self.alpha = approachLinear(self.alpha, mxnFxAlphaVisibility.visible ? 1 : 0, 0.05));
}
