import { RgbInt } from "../math/number-alias-types";
import { AdjustColor } from "../pixi/adjust-color";

function getPreferredTextColor(backgroundColor: RgbInt) {
    const { r, g, b } = AdjustColor.pixi(backgroundColor).toRgb();
    return (r + g + b) >= 400 ? 0x000000 : 0xffffff;
}

export const SubjectiveColorAnalyzer = {
    getPreferredTextColor,
};
