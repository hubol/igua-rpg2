import { Tx } from "../../../assets/textures";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Effects.Sparkle24px.split({ width: 24 });

export function objFxSparkle24Px() {
    return objIndexedSprite(txs)
        .step(self => self.textureIndex = (self.textureIndex + 0.2) % txs.length)
        .anchored(0.5, 0.5);
}
