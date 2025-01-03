import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.BurstRound24.split({ count: 3 });

export function objFxBurstRound24() {
    return objEphemeralSprite(txs, Rng.float(1 / 6, 2 / 6)).anchored(0.5, 0.5).mixin(mxnBoilMirrorRotate);
}
