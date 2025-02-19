import { DisplayObject } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { Cutscene } from "../globals";
import { mxnInteract } from "./mxn-interact";

export function mxnCutscene<TObj extends DisplayObject>(obj: TObj, cutsceneFn: () => Coro.Type) {
    return obj.mixin(mxnInteract, () => Cutscene.play(cutsceneFn, { speaker: obj }));
}
