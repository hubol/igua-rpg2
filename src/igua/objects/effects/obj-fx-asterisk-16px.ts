import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.Asterisk16px.split({ width: 16 });

export function objFxAsterisk16Px() {
    return objEphemeralSprite(txs, Rng.float(0.1, 0.15))
        .anchored(0.5, 0.5)
        .mixin(mxnBoilMirrorRotate);
}
