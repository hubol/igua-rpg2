import { DisplayObject } from "pixi.js";
import { mxnInteract } from "./mxn-interact";
import { Cutscene } from "../globals";
import { RoutineGenerator } from "../../lib/game-engine/routines/routine-generator";

export function mxnCutscene<TObj extends DisplayObject>(obj: TObj, cutsceneFn: () => RoutineGenerator) {
    return obj.mixin(mxnInteract, () => {
        Cutscene.play(cutsceneFn);
    })
}