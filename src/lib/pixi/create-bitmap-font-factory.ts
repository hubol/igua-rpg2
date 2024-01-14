import { BitmapFont, Texture } from "pixi.js";

export async function createBitmapFontFactory(fntUrl: string) {
    const fntData = await fetch(fntUrl).then(x => x.text());

    return (texture: Texture) => BitmapFont.install(fntData, texture);
}