import { BaseTexture, Rectangle, SCALE_MODES, Texture, loadImageBitmap } from "pixi.js";
import { GeneratedTextureData } from "./generated/textures/generated-texture-data";
import { JobProgress } from "../lib/game-engine/job-progress";

const { txs } = GeneratedTextureData;

type Txs = typeof txs<Texture>;
type Textures = ReturnType<Txs>;

export let Tx: Textures = <any>{};

export async function loadTextureAssets(progress: JobProgress) {
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

    const texturesToLoadCount = Object.keys(GeneratedTextureData.txs).length;
    progress.increaseTotalJobsCount(texturesToLoadCount);

    const atlases = await Promise.all(
        GeneratedTextureData.atlases.map(
            atlas => loadTexture(atlas.url)
        ));

    const newTx: Parameters<Txs>[0] = (data) => {
        const baseTexture = atlases[data.atlas].baseTexture;
        const frame = new Rectangle(data.x, data.y, data.width, data.height);
        const tx = new Texture(baseTexture, frame);
        tx.id = data.id;
        return tx;
    }

    Tx = GeneratedTextureData.txs(newTx);
}

async function loadTexture(url: string) {
    const bitmap = await loadImageBitmap(url);
    const base = new BaseTexture(bitmap);

    base.resource.src = url;
    return new Texture(base);
}
