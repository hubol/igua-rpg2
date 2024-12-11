import { ColorMatrixFilter } from "pixi.js";
import { AdjustColor } from "../adjust-color";

export class MapRgbFilter extends ColorMatrixFilter {
    constructor(red = 0, green = 0, blue = 0) {
        super();
        const r = AdjustColor.pixi(red).toRgb({});
        const g = AdjustColor.pixi(green).toRgb({});
        const b = AdjustColor.pixi(blue).toRgb({});

        this.matrix = [
            r.r / 255,
            g.r / 255,
            b.r / 255,
            0,
            0,
            r.g / 255,
            g.g / 255,
            b.g / 255,
            0,
            0,
            r.b / 255,
            g.b / 255,
            b.b / 255,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
        ];
    }
}
