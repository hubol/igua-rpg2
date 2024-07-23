import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { playerObj } from "./obj-player";
import { RpgProgress } from "../rpg/rpg-progress";

type ValuableType = 'green' | 'orange' | 'blue';

interface ValuableConfig {
    texture: Texture;
    value: number;
    // TODO sfx?!
}

// TODO note: values might come from NG+ levels
// Or there may need to be more valuable types
const valuableConfigs: Record<ValuableType, ValuableConfig> = {
    green: {
        texture: Tx.Collectibles.ValuableGreen,
        value: 1,
    },
    orange: {
        texture: Tx.Collectibles.ValuableOrange,
        value: 5,
    },
    blue: {
        texture: Tx.Collectibles.ValuableBlue,
        value: 15,
    },
}

// TODO flag id argument for valuables placed in levels
export function objValuable(type: ValuableType) {
    const config = valuableConfigs[type];
    return Sprite.from(config.texture)
        .anchored(0.5, 0.5)
        .step(self => {
            if (self.collides(playerObj)) {
                // TODO sfx
                // TODO vfx
                RpgProgress.character.valuables += config.value;
                self.destroy();
            }
        })
}