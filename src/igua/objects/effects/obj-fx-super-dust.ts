import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.SuperDust.split({ width: 84 });

export function objFxSuperDust() {
    return objEphemeralSprite(txs, txs.length / Rng.float(15, 20))
        .scaled(Rng.intp(), 1)
        .anchored(0.5, 1);
}
