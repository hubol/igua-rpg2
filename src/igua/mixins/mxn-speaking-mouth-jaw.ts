import { DisplayObject } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { VectorSimple } from "../../lib/math/vector-type";
import { mxnSpeakingMouth } from "./mxn-speaking-mouth";

export function mxnSpeakingMouthJaw(obj: DisplayObject, agapePosition: VectorSimple, durationFrames: Integer) {
    let agapeUnit = 0;

    return obj.mixin(
        mxnSpeakingMouth,
        {
            get agapeUnit() {
                return agapeUnit;
            },
            set agapeUnit(value) {
                if (agapeUnit === value) {
                    return;
                }
                agapeUnit = value;
                obj.at(agapePosition, value).vround();
            },
            baseAnimationDuration: durationFrames,
        },
    );
}
