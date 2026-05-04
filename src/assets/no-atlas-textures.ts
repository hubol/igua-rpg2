import { Texture, WRAP_MODES } from "pixi.js";
import { TextureProcessing } from "../lib/pixi/texture-processing";
import { Tx } from "./textures";

// For tiled textures,
// I think it is not possible to keep them stored in a texture atlas.
// For this reason, it is necessary to extract textures to be tiled
// to their own textures.

// It bothered me to modify textures in the Tx "namespace".
// So instead, non-atlased textures are added to the NoAtlasTx "namespace".

export let NoAtlasTx: NoAtlasTextures = {} as any;

type NoAtlasTextures = Awaited<ReturnType<typeof createNoAtlasTx>>;

async function createNoAtlasTx(tx: typeof Tx) {
    return {
        Effects: {
            Noise256: await wrap(tx.Effects.Noise256),
            CrackedEarth: await wrap(tx.Effects.CrackedEarth, WRAP_MODES.MIRRORED_REPEAT),
        },
        Enemy: {
            Brick: {
                Pattern0: await wrap(tx.Enemy.Brick.Pattern0),
            },
            Chill: {
                Aoe: await wrap(tx.Enemy.Chill.Aoe),
            },
        },
        Iguana: {
            Robot: {
                Panels: {
                    Large: await wrap(tx.Iguana.Robot.Panels.Large, WRAP_MODES.MIRRORED_REPEAT),
                },
            },
        },
        Terrain: {
            Pipe: {
                Brick: await wrap(tx.Terrain.Pipe.Brick),
                Gray: await wrap(tx.Terrain.Pipe.Gray),
            },
        },
    };
}

function wrap(tx: Texture, wrapMode = WRAP_MODES.REPEAT) {
    return TextureProcessing.extractFromAtlas(tx, { wrapMode });
}

export async function loadNoAtlasTextures(tx: typeof Tx) {
    NoAtlasTx = await createNoAtlasTx(tx);
}
