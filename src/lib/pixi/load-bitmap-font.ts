import { Assets, BitmapFont, Texture } from "pixi.js";

export async function loadBitmapFont(fntUrl: string, textureOrUrl: Texture | string) {
    const [ fntData, texture ] = await Promise.all([
        fetch(fntUrl).then(x => x.text()),
        typeof textureOrUrl === 'string' ? Assets.load<Texture>(textureOrUrl) : textureOrUrl,
    ]);

    return BitmapFont.install(fntData, texture);
}