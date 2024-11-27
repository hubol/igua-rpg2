import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { RpgProgress } from "../rpg/rpg-progress";
import { VectorSimple, vnew } from "../../lib/math/vector-type";
import { objValuableSparkle } from "./effects/obj-valuable-sparkle";
import { Rng } from "../../lib/math/rng";
import { mxnCollectible } from "../mixins/mxn-collectible";
import { RpgEconomy } from "../rpg/rpg-economy";
import { Sound } from "../../lib/game-engine/audio/sound";
import { Sfx } from "../../assets/sounds";

interface ValuableConfig {
    texture: Texture;
    sparkle: { offsets: VectorSimple[] };
    sound: Sound;
}

const valuableConfigs: Record<RpgEconomy.Currency.Type, ValuableConfig> = {
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

export function objValuable(type: RpgEconomy.Currency.Type, uid?: number) {
    let collectableAfterSteps = 3;

    const config = valuableConfigs[type];
    return Sprite.from(config.texture)
        .anchored(0.5, 0.5)
        .mixin(mxnCollectible, uid === undefined ? { type: "transient" } : { type: "uid", uid, set: "valuables" })
        .handles("collected", self => {
            config.sound.play();
            for (const offset of config.sparkle.offsets) {
                const sparkle = objValuableSparkle()
                    .at(self).add(offset).show(self.parent);
                sparkle.index = Rng.float(1, 3);
            }
            RpgProgress.character.inventory.valuables += RpgEconomy.Currency.Values[type];
        })
        .step(self => self.collectable = collectableAfterSteps-- <= 0);
}

export type ObjValuable = ReturnType<typeof objValuable>;
