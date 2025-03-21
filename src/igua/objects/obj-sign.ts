import { Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { container } from "../../lib/pixi/container";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";

interface ObjSignArgs {
    title: string;
    message: string;
    isSpecial: boolean;
}

export function objSign({ title, message, isSpecial }: ObjSignArgs) {
    const spr = Sprite.from(Tx.Wood.Sign);
    const text = objText.XSmallIrregular(title, { tint: 0x854E31 }).anchored(0.5, 0.5).at(25, 11);

    return container(spr, text)
        .mixin(mxnCutscene, () => {
            Sfx.Interact.SignRead.play();
            return show(message);
        })
        .mixin(mxnSpeaker, { name: "Sign", colorPrimary: 0x600000, colorSecondary: 0x400000 })
        .merge({ isSpecial })
        .track(objSign)
        .at(0, -26);
}

export type ObjSign = ReturnType<typeof objSign>;
