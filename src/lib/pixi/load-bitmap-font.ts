import { BitmapFont, Texture } from "pixi.js";

export async function loadBitmapFont(fntUrl: string, texture: Texture) {
    const fntData = await fetch(fntUrl).then(x => x.text());
    return BitmapFont.install(fntData, texture);
}