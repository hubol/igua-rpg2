import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";

interface ObjSignArgs {
    title: string;
    message: string;
}

export function objSign({ title, message }: ObjSignArgs) {
    const spr = Sprite.from(Tx.Wood.Sign);
    const text = objText.Small(title, { tint: 0x896037 }).at(1, 1);

    return container(spr, text)
        .mixin(mxnCutscene, () => show(message))
        .at(0, -16);
}