import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.ValuableSparkle.split({ count: 5 });

export function objValuableSparkle() {
    return objEphemeralSprite(txs, Rng.float(1/6, 2/6)).anchored(0.5, 0.5);
}