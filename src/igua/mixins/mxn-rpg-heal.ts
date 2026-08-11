import { DisplayObject } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { MxnRpgStatus } from "./mxn-rpg-status";

export function mxnRpgHeal(obj: DisplayObject, targetObjs: MxnRpgStatus[], amount: Integer) {
    const healedObjs = new Set<MxnRpgStatus>();

    return obj
        .dispatches<"mxnRpgHeal:healed">()
        .step(self => {
            const collidedTargetObj = self.collidesAll(targetObjs)
                .find(obj => obj.status.health > 0 && !healedObjs.has(obj));
            if (!collidedTargetObj) {
                return;
            }

            if (!self.collidesOne(collidedTargetObj.hurtboxes)) {
                return;
            }

            collidedTargetObj.heal(amount);
            self.dispatch("mxnRpgHeal:healed");
            healedObjs.add(collidedTargetObj);
        });
}
