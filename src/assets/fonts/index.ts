import { BitmapFont, IBitmapTextStyle } from "pixi.js";
import { JobProgress } from "../../lib/game-engine/job-progress";
import { createBitmapFontFactory } from "../../lib/pixi/create-bitmap-font-factory";
import { Force } from "../../lib/types/force";
import { BitmapText } from "pixi.js";
import { Tx } from "../textures";
import { intervalWait } from "../../lib/browser/interval-wait";

type Style = Partial<Omit<IBitmapTextStyle, "fontName">>;

export const objText = {
    Small(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Atomix.font, ...style });
    },
    Large(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Acrobatix.font, ...style });
    },
    Large2(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Erotix.font, ...style });
    },
    Large2Light(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.ErotixLight.font, ...style });
    },
    MediumDigits(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Diggit.font, ...style });
    },
};

const Fonts = {
    Acrobatix: Force<BitmapFont>(),
    Atomix: Force<BitmapFont>(),
    Diggit: Force<BitmapFont>(),
    Erotix: Force<BitmapFont>(),
    ErotixLight: Force<BitmapFont>(),
};

type TxFontKey = keyof typeof Tx['Font'];

export async function loadFontAssets(progress: JobProgress) {
    const load = async (fontKey: keyof typeof Fonts, fntUrl: string, txFontKey: TxFontKey) => {
        const bitmapFont = await loadBitmapFontAndTrackProgress(fntUrl, txFontKey, progress);
        Fonts[fontKey] = bitmapFont;
    };

    await Promise.all([
        load("Acrobatix", require("./bitmap/Acrobatix.fnt"), "Acrobatix"),
        load("Atomix", require("./bitmap/Atomix.fnt"), "Atomix"),
        load("Diggit", require("./bitmap/Diggit.fnt"), "Diggit"),
        load("Erotix", require("./bitmap/Erotix.fnt"), "Erotix"),
        load("ErotixLight", require("./bitmap/ErotixLight.fnt"), "ErotixLight"),
    ]);
}

async function loadBitmapFontAndTrackProgress(fntUrl: string, txFontKey: TxFontKey, progress: JobProgress) {
    progress.increaseTotalJobsCount(1);

    const [ bitmapFontFactory ] = await Promise.all([
        createBitmapFontFactory(fntUrl),
        intervalWait(() => !!Tx?.Font?.[txFontKey]),
    ]);

    progress.increaseCompletedJobsCount(1);
    return bitmapFontFactory(Tx.Font[txFontKey]);
}