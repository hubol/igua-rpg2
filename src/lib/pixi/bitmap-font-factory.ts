import { BitmapFont, Texture } from "pixi.js";

export async function createBitmapFontFactory(fntUrl: string) {
    const fntData = await fetch(fntUrl).then(x => x.text()).then(preprocessFntText);

    return (texture: Texture) => BitmapFont.install(fntData, texture);
}

const atSignRegex = /(?:@(.))/gm;
const atSignSubstitution = (_: string, y: string) => String(y.charCodeAt(0));

// Allows writing e.g. @a and replacing with 97
function preprocessFntText(fntText: string) {
    if (!fntText.includes("info NeedsPreprocessing")) {
        return fntText;
    }
    return fntText.replace(atSignRegex, atSignSubstitution);
}
