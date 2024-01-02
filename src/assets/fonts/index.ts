import { BitmapFont, IBitmapTextStyle } from "pixi.js";
import { JobProgress } from "../../lib/game-engine/job-progress";
import { loadBitmapFont } from "../../lib/pixi/load-bitmap-font";
import { Force } from "../../lib/types/force";
import { BitmapText } from "pixi.js";

type Style = Partial<Omit<IBitmapTextStyle, "fontName">>;

export const objText = {
    Small(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Atomix.font, ...style });
    },
    Large(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Acrobatix.font, ...style });
    },
    MediumDigits(text = '', style: Style = {}) {
        return new BitmapText(text, { fontName: Fonts.Diggit.font, ...style });
    },
};

const Fonts = {
    Acrobatix: Force<BitmapFont>(),
    Atomix: Force<BitmapFont>(),
    Diggit: Force<BitmapFont>(),
};

export async function loadFontAssets(progress: JobProgress) {
    const load = async (fontKey: keyof typeof Fonts, fntUrl: string, textureUrl: string) => {
        const bitmapFont = await loadBitmapFontAndTrackProgress(fntUrl, textureUrl, progress);
        Fonts[fontKey] = bitmapFont;
    };

    await Promise.all([
        load("Acrobatix", require("./bitmap/Acrobatix.fnt"), require("./bitmap/Acrobatix.png")),
        load("Atomix", require("./bitmap/Atomix.fnt"), require("./bitmap/Atomix.png")),
        load("Diggit", require("./bitmap/Diggit.fnt"), require("./bitmap/Diggit.png")),
    ]);
}

async function loadBitmapFontAndTrackProgress(fntUrl: string, textureUrl: string, progress: JobProgress) {
    progress.increaseTotalJobsCount(1);
    const bitmapFont = await loadBitmapFont(fntUrl, textureUrl);
    progress.increaseCompletedJobsCount(1);
    return bitmapFont;
}