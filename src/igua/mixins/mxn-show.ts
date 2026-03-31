import { DisplayObject } from "pixi.js";
import { show } from "../drama/show";
import { mxnCutscene } from "./mxn-cutscene";

export function mxnShow(obj: DisplayObject, ...messsages: string[]) {
    return obj
        .mixin(mxnCutscene, function* () {
            yield* show(...messsages.filter(Boolean));
        });
}
