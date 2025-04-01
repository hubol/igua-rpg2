import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.SpiritualRelease0.split({ width: 52 });

export function objFxSpiritualRelease() {
    return objEphemeralSprite(txs, Rng.float(9 / 60, 14 / 60)).anchored(1 / 52, 16 / 68);
}
