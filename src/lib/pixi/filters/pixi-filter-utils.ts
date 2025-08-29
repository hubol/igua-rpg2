import { RgbInt } from "../../math/number-alias-types";
import { AdjustColor } from "../adjust-color";

export namespace PixiFilterUtils {
    export function getRgbIntAsGlslVec3(color: RgbInt) {
        const { r, g, b } = AdjustColor.pixi(color).toRgb();
        return [r / 255, g / 255, b / 255];
    }
}
