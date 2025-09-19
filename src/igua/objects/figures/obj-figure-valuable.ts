import { Sprite, Texture } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Sound } from "../../../lib/game-engine/audio/sound";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { RpgEconomy } from "../../rpg/rpg-economy";
import { objValuableSparkle } from "../effects/obj-valuable-sparkle";

interface ValuableFigureConfig {
    texture: Texture;
    sparkle: { offsets: VectorSimple[] };
    sound: Sound;
}

const valuableFigureConfigs: Record<RpgEconomy.Valuables.Kind, ValuableFigureConfig> = {
    green: {
        texture: Tx.Collectibles.ValuableGreen,
        sparkle: {
            offsets: [vnew()],
        },
        sound: Sfx.Collect.Valuable1,
    },
    orange: {
        texture: Tx.Collectibles.ValuableOrange,
        sparkle: {
            offsets: [vnew(0, 3), vnew(-5, -4), vnew(4, -5)],
        },
        sound: Sfx.Collect.Valuable5,
    },
    blue: {
        texture: Tx.Collectibles.ValuableBlue,
        sparkle: {
            offsets: [vnew(0, 3), vnew(-4, -5), vnew(5, -4)],
        },
        sound: Sfx.Collect.Valuable15,
    },
};

export function objFigureValuable(kind: RpgEconomy.Valuables.Kind) {
    const config = valuableFigureConfigs[kind];
    const sprite = Sprite.from(config.texture);

    const methods = {
        collectFx() {
            sprite.play(config.sound);
            const position = sprite.getWorldPosition();
            for (const offset of config.sparkle.offsets) {
                const sparkle = objValuableSparkle()
                    .at(position).add(offset).show();
                sparkle.index = Rng.float(1, 3);
            }
        },
    };

    return sprite
        .anchored(0.5, 0.5)
        .merge({ objFigureValuable: { methods } });
}
