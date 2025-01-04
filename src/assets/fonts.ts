import { IBitmapTextStyle } from "pixi.js";
import { BitmapText } from "pixi.js";
import { IrregularBitmapText } from "../igua/lib/irregular-bitmap-text";
import { fntErotix } from "./bitmap-fonts/fnt-erotix";
import { fntDiggit } from "./bitmap-fonts/fnt-diggit";
import { fntErotixLight } from "./bitmap-fonts/fnt-erotix-light";
import { fntFlaccid } from "./bitmap-fonts/fnt-flaccid";
import { fntGoodBoy } from "./bitmap-fonts/fnt-good-boy";

type Style = Partial<Omit<IBitmapTextStyle, "fontName">>;

export const objText = {
    Small(text = "", style: Style = {}) {
        return new IrregularBitmapText(text, { fontName: fntFlaccid.font, ...style });
    },
    MediumDigits(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: fntDiggit.font, ...style });
    },
    Large(text = "", style: Style = {}) {
        return new IrregularBitmapText(text, { fontName: fntErotixLight.font, ...style });
    },
    // TODO rename ^ LargeIrregular
    LargeRegular(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: fntErotixLight.font, ...style });
    },
    LargeBold(text = "", style: Style = {}) {
        return new IrregularBitmapText(text, { fontName: fntErotix.font, ...style });
    },
    Tall(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: fntGoodBoy.font, ...style });
    },
};
