import { Assets, BaseTexture, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { GeneratedTextureData } from "./generated/textures";
import { JobProgress } from "../lib/game-engine/job-progress";

const { txs } = GeneratedTextureData;

type Textures = ReturnType<typeof txs<Texture>>;

export let Tx: Textures = <any>{};

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

    Tx = GeneratedTextureData.txs((data) => {
        const baseTexture = atlases[data.atlas].baseTexture;
        const frame = new Rectangle(data.x, data.y, data.width, data.height);
        return new Texture(baseTexture, frame);
        // TODO texture.asshatTextureId = textureId;
    });
}