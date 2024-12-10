import { BitmapFont, IBitmapTextStyle } from "pixi.js";
import { JobProgress } from "../lib/game-engine/job-progress";
import { Force } from "../lib/types/force";
import { BitmapText } from "pixi.js";
import { Tx } from "./textures";
import { intervalWait } from "../lib/browser/interval-wait";
import { IrregularBitmapText } from "../igua/lib/irregular-bitmap-text";
import { BitmapFontFactory } from "../lib/pixi/bitmap-font-factory";
import { fntErotix } from "./bitmap-fonts/fnt-erotix";
import { fntDiggit } from "./bitmap-fonts/fnt-diggit";
import { fntErotixLight } from "./bitmap-fonts/fnt-erotix-light";
import { fntFlaccid } from "./bitmap-fonts/fnt-flaccid";
import { fntGoodBoy } from "./bitmap-fonts/fnt-good-boy";

type Style = Partial<Omit<IBitmapTextStyle, "fontName">>;

export const objText = {
    Small(text = "", style: Style = {}) {
        return new IrregularBitmapText(text, { fontName: Fonts.Flaccid.font, ...style });
    },
    MediumDigits(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Diggit.font, ...style });
    },
    Large(text = "", style: Style = {}) {
        return new IrregularBitmapText(text, { fontName: Fonts.ErotixLight.font, ...style });
    },
    LargeBold(text = "", style: Style = {}) {
        return new IrregularBitmapText(text, { fontName: Fonts.Erotix.font, ...style });
    },
    Tall(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.GoodBoy.font, ...style });
    },
};

const Fonts = {
    Diggit: Force<BitmapFont>(),
    Erotix: Force<BitmapFont>(),
    ErotixLight: Force<BitmapFont>(),
    Flaccid: Force<BitmapFont>(),
    GoodBoy: Force<BitmapFont>(),
};

type TxFontKey = keyof typeof Tx["Font"];

export async function loadFontAssets(progress: JobProgress) {
    const load = async (fontKey: keyof typeof Fonts, createBitmapFont: BitmapFontFactory, txFontKey: TxFontKey) => {
        progress.increaseTotalJobsCount(1);

        await intervalWait(() => !!Tx?.Font?.[txFontKey]);

        Fonts[fontKey] = createBitmapFont(Tx.Font[txFontKey]);
        progress.increaseCompletedJobsCount(1);
    };

    await Promise.all([
        load("Diggit", fntDiggit, "Diggit"),
        load("Erotix", fntErotix, "Erotix"),
        load("ErotixLight", fntErotixLight, "ErotixLight"),
        load("Flaccid", fntFlaccid, "Flaccid"),
        load("GoodBoy", fntGoodBoy, "GoodBoy"),
    ]);
}
