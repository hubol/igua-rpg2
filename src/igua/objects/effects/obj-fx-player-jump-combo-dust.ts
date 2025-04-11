import { Tx } from "../../../assets/textures";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.PlayerJumpComboDust.split({ width: 28 });

export function objFxPlayerJumpComboDust() {
    return objEphemeralSprite(txs, 0.2).pivoted(0, 18);
}
