import { degDifference } from "../math/angle";
import { RgbInt } from "../math/number-alias-types";
import { AdjustColor } from "../pixi/adjust-color";

function getPreferredTextColor(backgroundColor: RgbInt) {
    const { r, g, b } = AdjustColor.pixi(backgroundColor).toRgb();
    return (r + g + b) >= 400 ? 0x000000 : 0xffffff;
}

function getColorWithHighestContrast(rgb: RgbInt, rgbOptions: RgbInt[]) {
    const { h, s, v } = AdjustColor.pixi(rgb).toHsv();

    let highestContrastDifferential = Number.MIN_VALUE;
    let highestContrastRgb = rgb;

    for (const rgbOption of rgbOptions) {
        const hsv = AdjustColor.pixi(rgbOption).toHsv();
        const differential = (degDifference(hsv.h, h) / 3.6) + Math.abs(hsv.s - s) + Math.abs(hsv.v - v);
        if (differential > highestContrastDifferential) {
            highestContrastDifferential = differential;
            highestContrastRgb = rgbOption;
        }
    }

    return highestContrastRgb;
}

export const SubjectiveColorAnalyzer = {
    getPreferredTextColor,
    getColorWithHighestContrast,
};
