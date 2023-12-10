import { Assets, BaseTexture, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { GeneratedTextureData } from "./generated/textures";
import { JobProgress } from "../lib/game-engine/job-progress";
import { AsshatTexture } from "../lib/game-engine/asshat-texture";

const { txs } = GeneratedTextureData;

type Txs = typeof txs<AsshatTexture>;
type Textures = ReturnType<Txs>;

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

    const newTx: Parameters<Txs>[0] = (data) => {
        const baseTexture = atlases[data.atlas].baseTexture;
        const frame = new Rectangle(data.x, data.y, data.width, data.height);
        return new AsshatTexture(data.id, baseTexture, frame);
    }

    Tx = GeneratedTextureData.txs(newTx);
}
