import { Sfx } from "../../assets/sounds";
import { Sound } from "../../lib/game-engine/audio/sound";

interface MaterialProperties {
    stepSound0: Sound;
    stepSound1: Sound;
    stepSound2: Sound;
    stepSound3: Sound;
}

export enum Material {
    Earth = 1,
    Metal = 2,
}

export const Materials = {
    [Material.Earth]: {
        stepSound0: Sfx.Terrain.EarthStep0,
        stepSound1: Sfx.Terrain.EarthStep1,
        stepSound2: Sfx.Terrain.EarthStep2,
        stepSound3: Sfx.Terrain.EarthStep3,
    },
    [Material.Metal]: {
        stepSound0: Sfx.Terrain.MetalStep0,
        stepSound1: Sfx.Terrain.MetalStep1,
        stepSound2: Sfx.Terrain.MetalStep2,
        stepSound3: Sfx.Terrain.MetalStep3,
    },
} satisfies Record<Material, MaterialProperties>;
