import { Tx } from "../../../assets/textures";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.Starburst54.split({ width: 54 });

export function objFxStarburst54() {
    return objEphemeralSprite(txs, 0.25).anchored(25 / 54, 27 / 56);
}
