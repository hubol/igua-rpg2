import { DisplayObject } from "pixi.js";
import { mxnInteract } from "./mxn-interact";
import { Cutscene } from "../globals";
import { Coro } from "../../lib/game-engine/routines/coro";
import { CtxShow } from "../cutscene/show";

export function mxnCutscene<TObj extends DisplayObject>(obj: TObj, cutsceneFn: () => Coro.Type) {
    return obj.mixin(mxnInteract, () => {
        CtxShow.speaker = obj;
        Cutscene.play(cutsceneFn);
    });
}
