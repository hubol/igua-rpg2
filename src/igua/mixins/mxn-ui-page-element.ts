import { Container, Graphics, Rectangle } from "pixi.js";
import { mxnBoilPivot } from "./mxn-boil-pivot";

const r = new Rectangle();

export function mxnUiPageElement(obj: Container) {
    const bounds = obj.getLocalBounds(r);

    let selected = false;

    const highlightObj = new Graphics().lineStyle(3, 0x00ff00, 1, 1).drawRect(
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
