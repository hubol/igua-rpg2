import { DisplayObject } from "pixi.js";
import { Unit } from "../../lib/math/number-alias-types";

interface MxnSpeakingMouthArgs {
    /** Should be implemented as a getter/setter */
    agapeUnit: Unit;
}

export function mxnSpeakingMouth(obj: DisplayObject, args: MxnSpeakingMouthArgs) {
    return obj.merge({ mxnSpeakingMouth: args });
}

export type MxnMouth = ReturnType<typeof mxnSpeakingMouth>;
