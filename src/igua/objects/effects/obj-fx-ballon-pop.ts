import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.BallonPop.split({ width: 46 });

export function objFxBallonPop() {
    return objEphemeralSprite(txs, Rng.float(1.8 / 6, 2.3 / 6)).anchored(0.5, 0.5);
}
