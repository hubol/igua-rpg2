import { Sprite, Texture } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Sound } from "../../lib/game-engine/audio/sound";
import { Rng } from "../../lib/math/rng";
import { VectorSimple, vnew } from "../../lib/math/vector-type";
import { mxnCollectible } from "../mixins/mxn-collectible";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgPlayerWallet } from "../rpg/rpg-player-wallet";
import { objValuableSparkle } from "./effects/obj-valuable-sparkle";

interface ValuableConfig {
    texture: Texture;
    sparkle: { offsets: VectorSimple[] };
    sound: Sound;
}

const valuableConfigs: Record<RpgEconomy.Valuables.Kind, ValuableConfig> = {
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

export function objValuable(
    kind: RpgEconomy.Valuables.Kind,
    uid?: number,
    incomeSource: RpgPlayerWallet.IncomeSource = "default",
) {
    let collectableAfterSteps = 3;

    const config = valuableConfigs[kind];
    return Sprite.from(config.texture)
        .anchored(0.5, 0.5)
        .mixin(mxnCollectible, uid === undefined ? { kind: "transient" } : { kind: "uid", uid, set: "valuables" })
        .handles("collected", self => {
            config.sound.play();
            for (const offset of config.sparkle.offsets) {
                const sparkle = objValuableSparkle()
                    .at(self).add(offset).show(self.parent);
                sparkle.index = Rng.float(1, 3);
            }
            RpgPlayerWallet.earn("valuables", RpgEconomy.Valuables.Values[kind], incomeSource);
        })
        .step(self => self.collectable = collectableAfterSteps-- <= 0);
}

export type ObjValuable = ReturnType<typeof objValuable>;
