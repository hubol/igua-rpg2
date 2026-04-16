import { Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { container } from "../../lib/pixi/container";
import { mxnSign } from "../mixins/mxn-sign";

interface ObjSignArgs {
    title: string;
    message: string;
    isSpecial: boolean;
}

export function objSign(args: ObjSignArgs) {
    const spr = Sprite.from(Tx.Wood.Sign);
    const text = objText.XSmallIrregular(args.title, { tint: 0x854E31 })
        .anchored(0.5, 0.5)
        .at(25, 11)
        .step(self => self.text = args.title);

    return container(spr, text)
        .mixin(mxnSign, () => args.message)
        .merge({ isSpecial: args.isSpecial })
        .track(objSign)
        .at(0, -26);
}

export type ObjSign = ReturnType<typeof objSign>;
