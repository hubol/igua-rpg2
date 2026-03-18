import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { show } from "../drama/show";
import { mxnCutscene } from "./mxn-cutscene";
import { mxnSpeaker } from "./mxn-speaker";

export function mxnSign(obj: DisplayObject, message: string) {
    return obj.mixin(mxnCutscene, () => {
        Sfx.Interact.SignRead.play();
        return show(message);
    })
        .mixin(mxnSpeaker, { name: "Sign", tintPrimary: 0x600000, tintSecondary: 0x400000 });
}
