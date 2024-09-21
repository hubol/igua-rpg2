import { BitmapFont, IBitmapTextStyle } from "pixi.js";
import { JobProgress } from "../lib/game-engine/job-progress";
import { createBitmapFontFactory } from "../lib/pixi/bitmap-font-factory";
import { Force } from "../lib/types/force";
import { BitmapText } from "pixi.js";
import { Tx } from "./textures";
import { intervalWait } from "../lib/browser/interval-wait";

type Style = Partial<Omit<IBitmapTextStyle, "fontName">>;

export const objText = {
    Small(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Flaccid.font, ...style });
    },
    MediumDigits(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Diggit.font, ...style });
    },
    Large(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.ErotixLight.font, ...style });
    },
    LargeBold(text = "", style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Erotix.font, ...style });
    },
};

const Fonts = {
    Diggit: Force<BitmapFont>(),
    Erotix: Force<BitmapFont>(),
    ErotixLight: Force<BitmapFont>(),
    Flaccid: Force<BitmapFont>(),
};

type TxFontKey = keyof typeof Tx["Font"];

export async function loadFontAssets(progress: JobProgress) {
    const load = async (fontKey: keyof typeof Fonts, fntUrl: string, txFontKey: TxFontKey) => {
        const bitmapFont = await loadBitmapFontAndTrackProgress(fntUrl, txFontKey, progress);
        Fonts[fontKey] = bitmapFont;
    };

    await Promise.all([
        load("Diggit", require("./font-bitmaps/Diggit.fnt"), "Diggit"),
        load("Erotix", require("./font-bitmaps/Erotix.fnt"), "Erotix"),
        load("ErotixLight", require("./font-bitmaps/ErotixLight.fnt"), "ErotixLight"),
        load("Flaccid", require("./font-bitmaps/Flaccid.fnt"), "Flaccid"),
    ]);
}

async function loadBitmapFontAndTrackProgress(fntUrl: string, txFontKey: TxFontKey, progress: JobProgress) {
    progress.increaseTotalJobsCount(1);

    const [createBitmapFont] = await Promise.all([
        createBitmapFontFactory(fntUrl),
        intervalWait(() => !!Tx?.Font?.[txFontKey]),
    ]);

    progress.increaseCompletedJobsCount(1);
    return createBitmapFont(Tx.Font[txFontKey]);
}
