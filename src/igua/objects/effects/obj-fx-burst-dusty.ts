import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.BurstDusty.split({ width: 94 });

export function objFxBurstDusty() {
    return objEphemeralSprite(txs, Rng.float(12 / 60, 15 / 60)).anchored(46 / 94, 44 / 86);
}
