import { DisplayObject } from "pixi.js";
import { mxnRpgAttack } from "./mxn-rpg-attack";

export function mxnDischargeable(obj: DisplayObject) {
    let isCharged = false;
    let isDischargeRequested = false;
    let isDischarged = false;

    const state = {
        charge() {
            isCharged = true;
            isDischarged = isCharged && isDischargeRequested;
        },
        discharge() {
            isDischargeRequested = true;
            isDischarged = isCharged && isDischargeRequested;
        },
        get isCharged() {
            return isCharged;
        },
        get isDischarged() {
            return isDischarged;
        },
    };

    return obj
        .merge({ mxnDischargeable: state })
        .step(self => {
            if (self.is(mxnRpgAttack)) {
                self.isAttackActive = isDischarged;
            }
        });
}
