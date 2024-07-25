import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { playerObj } from "./obj-player";
import { RpgProgress } from "../rpg/rpg-progress";
import { VectorSimple, vnew } from "../../lib/math/vector-type";
import { objValuableSparkle } from "./effects/obj-valuable-sparkle";
import { Rng } from "../../lib/math/rng";

type ValuableType = 'green' | 'orange' | 'blue';

interface ValuableConfig {
    texture: Texture;
    value: number;
    sparkle: { offsets: VectorSimple[]; }
    // TODO sfx?!
}

// TODO note: values might come from NG+ levels
// Or there may need to be more valuable types
const valuableConfigs: Record<ValuableType, ValuableConfig> = {
    green: {
        texture: Tx.Collectibles.ValuableGreen,
        value: 1,
        sparkle: {
            offsets: [ vnew() ],
        }
    },
    orange: {
        texture: Tx.Collectibles.ValuableOrange,
        value: 5,
        sparkle: {
            offsets: [ vnew(0, 3), vnew(-5, -4), vnew(4, -5) ],
        }
    },
    blue: {
        texture: Tx.Collectibles.ValuableBlue,
        value: 15,
        sparkle: {
            offsets: [ vnew(0, 3), vnew(-4, -5), vnew(5, -4) ],
        }
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
                for (const offset of config.sparkle.offsets) {
                    const sparkle = objValuableSparkle()
                    .at(self).add(offset).show(self.parent);
                    sparkle.index = Rng.float(1, 3);
                }
                RpgProgress.character.valuables += config.value;
                self.destroy();
            }
        })
}