import { Graphics } from "pixi.js";
import { blendColor } from "../../../lib/color/blend-color";
import { nlerp } from "../../../lib/math/number";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { mxnFxFactor } from "../../mixins/effects/mxn-fx-factor";

interface ObjFxRippleKeyframe {
    radius: Integer;
    stroke: Integer;
    tint: RgbInt;
}

export function objFxRipple(start: ObjFxRippleKeyframe, end: ObjFxRippleKeyframe) {
    const gfx = new Graphics();

    let appliedFactor = 0;

    const mxnFxFactorArgs = {
        get factor() {
            return appliedFactor;
        },
        set factor(value) {
            if (appliedFactor === value) {
                return;
            }

            gfx.clear();

            const factor = Math.max(0, Math.min(1, value));

            if (factor === 0) {
                return;
            }

            const tint = blendColor(start.tint, end.tint, factor);
            const stroke = Math.ceil(nlerp(start.stroke, end.stroke, factor));
            const radius = Math.ceil(nlerp(start.radius, end.radius, factor));
            gfx
                .lineStyle(stroke, tint, 1, 0.5)
                .drawCircle(0, 0, radius);
        },
    };

    return gfx
        .mixin(mxnFxFactor, mxnFxFactorArgs);
}
