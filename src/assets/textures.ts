import { Assets, Rectangle, Texture } from "pixi.js";
import { GeneratedTextureData } from "./generated/textures";
import { JobProgress } from "../lib/game-engine/job-progress";

type TextureId = keyof typeof GeneratedTextureData['txs'];

export const Txs: Record<TextureId, Texture> = <any>{};

export async function loadTextureAssets(progress: JobProgress) {
    const texturesToLoadCount = Object.keys(GeneratedTextureData.txs).length;
    progress.increaseTotalJobsCount(texturesToLoadCount);

    const atlases = await Promise.all(
        GeneratedTextureData.atlases.map(
            atlas => Assets.load<Texture>(atlas.url).then(texture => {
                progress.increaseCompletedJobsCount(atlas.texturesCount);
                return texture;
            })));
    
    for (const [textureId, data] of Object.entries(GeneratedTextureData.txs)) {
        const baseTexture = atlases[data.atlas].baseTexture;
        const frame = new Rectangle(data.x, data.y, data.width, data.height);
        Txs[textureId] = new Texture(baseTexture, frame);
    }
}