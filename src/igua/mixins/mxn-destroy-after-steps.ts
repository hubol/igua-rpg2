import { DisplayObject } from "pixi.js";

export function mxnDestroyAfterSteps(obj: DisplayObject, steps: number) {
    return obj.step(() => {
        if (steps-- <= 0) {
            obj.destroy();
        }
    });
}
