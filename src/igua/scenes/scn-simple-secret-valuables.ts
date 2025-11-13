import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { mxnWeightedPedestalMask } from "../mixins/mxn-weighted-pedestal-mask";

export function scnSimpleSecretValuables() {
    const lvl = Lvl.SimpleSecretValuables();
    enrichPedestal(lvl);
}

function enrichPedestal(lvl: LvlType.SimpleSecretValuables) {
    lvl.WeightedPedestal.mixin(mxnWeightedPedestalMask, {
        terrainObjs: [lvl.PedestalBlock0, lvl.PedestalBlock1],
        maskWhenWeighted: false,
    });
}
