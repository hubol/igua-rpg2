import { Container, Graphics, Rectangle } from "pixi.js";
import { RgbInt } from "../../lib/math/number-alias-types";
import { mxnBoilPivot } from "./mxn-boil-pivot";

const r = new Rectangle();

interface MxnUiPageElementArgs {
    tint?: RgbInt;
}

export function mxnUiPageElement(obj: Container, { tint = 0x00ff00 }: MxnUiPageElementArgs = {}) {
    const bounds = obj.getLocalBounds(r);

    let selected = false;

    const highlightObj = new Graphics().lineStyle(3, tint, 1, 1).drawRect(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
    ).mixin(mxnBoilPivot)
        .invisible()
        .show(obj);

    return obj.merge({
        get selected() {
            return selected;
        },
        set selected(value) {
            selected = value;
            highlightObj.visible = value;
        },
    });
}

export type MxnUiPageElement = ReturnType<typeof mxnUiPageElement>;
