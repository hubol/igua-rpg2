import { Tx } from "../../../assets/textures";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.FieryBurst170px.split({ width: 170 });

export function objFxFieryBurst170px() {
    // TODO sfx
    return objEphemeralSprite(txs, 0.125).anchored(93 / 170, 83 / 150);
}
