import { DisplayObject } from "pixi.js";

export function mxnFxBlink(obj: DisplayObject, hz: number) {
    let points = 0;
    return obj
        .step(() => {
            points += (1 / 60) * hz;
            if (points >= 1) {
                points %= 1;
                obj.visible = !obj.visible;
            }
        });
}
