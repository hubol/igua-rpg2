import { DisplayObject } from "pixi.js";
import { mxnInteract } from "./mxn-interact";
import { Cutscene } from "../globals";

export function mxnCutscene<TObj extends DisplayObject>(obj: TObj, cutsceneFn: () => Promise<unknown>) {
    return obj.mixin(mxnInteract, () => {
        Cutscene.play(cutsceneFn);
    })
}