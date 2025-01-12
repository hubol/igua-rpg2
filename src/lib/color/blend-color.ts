import { approachLinear, nlerp } from "../math/number";
import { Float255, RgbInt, Unit } from "../math/number-alias-types";
import { AdjustColor } from "../pixi/adjust-color";

// TODO IDK, feels like there should be something for this too
const startRgb = { r: 0, g: 0, b: 0 };
const endRgb = { r: 0, g: 0, b: 0 };
const blendedRgb = { r: 0, g: 0, b: 0 };

export function blendColor(start: RgbInt, end: RgbInt, factor: Unit) {
    AdjustColor.pixi(start).toRgb(startRgb);
    AdjustColor.pixi(end).toRgb(endRgb);

    blendedRgb.r = nlerp(startRgb.r, endRgb.r, factor);
    blendedRgb.g = nlerp(startRgb.g, endRgb.g, factor);
    blendedRgb.b = nlerp(startRgb.b, endRgb.b, factor);

    return AdjustColor.rgb(blendedRgb.r, blendedRgb.g, blendedRgb.b).toPixi();
}

export function blendColorDelta(start: RgbInt, end: RgbInt, delta: Float255) {
    AdjustColor.pixi(start).toRgb(startRgb);
    AdjustColor.pixi(end).toRgb(endRgb);

    blendedRgb.r = approachLinear(startRgb.r, endRgb.r, delta);
    blendedRgb.g = approachLinear(startRgb.g, endRgb.g, delta);
    blendedRgb.b = approachLinear(startRgb.b, endRgb.b, delta);

    return AdjustColor.rgb(blendedRgb.r, blendedRgb.g, blendedRgb.b).toPixi();
}
