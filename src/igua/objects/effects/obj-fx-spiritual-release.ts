import { Tx } from "../../../assets/textures";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";
import { objDieOnEmpty } from "../utils/obj-die-on-empty";

const txs = Tx.Effects.SpiritualRelease0.split({ width: 52 });

export function objFxSpiritualRelease() {
    return objEphemeralSprite(txs, Rng.float(9 / 60, 14 / 60)).anchored(1 / 52, 16 / 68);
}

interface ObjBurstArgs {
    halfWidth?: number;
    halfHeight?: number;
    tints: RgbInt[];
}

objFxSpiritualRelease.objBurst = function objBurst ({ halfWidth = 0, halfHeight = 0, tints }: ObjBurstArgs) {
    return objDieOnEmpty(
        objFxSpiritualRelease().tinted(Rng.item(tints))
            .scaled(-1, 1)
            .at(-halfWidth, halfHeight),
        objFxSpiritualRelease().tinted(Rng.item(tints))
            .scaled(1, 1)
            .angled(-90)
            .at(halfWidth, -halfHeight),
        objFxSpiritualRelease().tinted(Rng.item(tints))
            .scaled(-1, -1)
            .at(-halfWidth, -halfHeight),
        objFxSpiritualRelease().tinted(Rng.item(tints))
            .scaled(1, 1)
            .at(halfWidth, halfHeight),
    );
};
