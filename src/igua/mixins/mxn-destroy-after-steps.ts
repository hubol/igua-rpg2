import { DisplayObject } from "pixi.js";

export function mxnDestroyAfterSteps(obj: DisplayObject, stepsUntilDestroyed: number) {
    return obj.merge({
        stepsUntilDestroyed,
        get stepsUntilDestroyedAsUnit() {
            return this.stepsUntilDestroyed / stepsUntilDestroyed;
        },
    }).step((self) => {
        if (self.stepsUntilDestroyed-- <= 0) {
            obj.destroy();
        }
    });
}
