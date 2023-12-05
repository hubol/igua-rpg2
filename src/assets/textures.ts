import { Assets, BaseTexture, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { GeneratedTextureData } from "./generated/textures";
import { JobProgress } from "../lib/game-engine/job-progress";

type GeneratedTextureDataType = typeof GeneratedTextureData['txs'];
type TextureId = keyof typeof GeneratedTextureData['txs'];

export const Tx: Map<GeneratedTextureDataType> = <any>{};

interface TextureLike {
    atlas: number;
}

// Thank you https://github.com/jquense/yup/blob/94cfd11b3f23e10f731efac05c5525829d10ded1/src/index.ts#L40
type Map<T> = {
    [k in keyof T]: T[k] extends TextureLike
        ? Texture
        : T[k] extends Record<string, unknown>
        ? Map<T[k]>
        : never;
};

export async function loadTextureAssets(progress: JobProgress) {
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

    const texturesToLoadCount = Object.keys(GeneratedTextureData.txs).length;
    progress.increaseTotalJobsCount(texturesToLoadCount);

    const atlases = await Promise.all(
        GeneratedTextureData.atlases.map(
            atlas => Assets.load<Texture>(atlas.url).then(texture => {
                progress.increaseCompletedJobsCount(atlas.texturesCount);
                return texture;
            })));
    
    for (const [textureId, data] of Object.entries(GeneratedTextureData.txs)) {
        if (!('atlas' in data))
            continue;
        const baseTexture = atlases[data.atlas].baseTexture;
        const frame = new Rectangle(data.x, data.y, data.width, data.height);
        const texture = new Texture(baseTexture, frame);
        texture.asshatTextureId = textureId;
        Tx[textureId] = texture;
    }
}