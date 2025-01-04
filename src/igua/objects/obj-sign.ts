import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { Sfx } from "../../assets/sounds";
import { mxnSpeaker } from "../mixins/mxn-speaker";

interface ObjSignArgs {
    title: string;
    message: string;
}

export function objSign({ title, message }: ObjSignArgs) {
    const spr = Sprite.from(Tx.Wood.Sign);
    const text = objText.Small(title, { tint: 0x854E31 }).anchored(0.5, 0.5).at(25, 11);

    return container(spr, text)
        .mixin(mxnCutscene, () => {
            Sfx.Interact.SignRead.play();
            return show(message);
        })
        .mixin(mxnSpeaker, { name: "Sign", colorPrimary: 0x600000, colorSecondary: 0x400000 })
        .at(0, -23);
}
