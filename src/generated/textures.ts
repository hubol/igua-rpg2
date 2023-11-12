import { Assets, Rectangle, Texture } from "pixi.js";
import { GeneratedTextureData } from "./output/textures";

type TextureId = keyof typeof GeneratedTextureData['txs'];

export const Txs: Record<TextureId, Texture> = <any>{};

export async function loadMyTextures() {
    const atlases = await Promise.all(
        GeneratedTextureData.atlases.map(atlas => Assets.load<Texture>(atlas)));
    
    for (const [textureId, data] of Object.entries(GeneratedTextureData.txs)) {
        const baseTexture = atlases[data.atlas].baseTexture;
        const frame = new Rectangle(data.x, data.y, data.width, data.height);
        Txs[textureId] = new Texture(baseTexture, frame);
    }
}