import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";

export function scnStrangeMarketGuardian() {
    const lvl = Lvl.StrangeMarketGuardian();

    [lvl.WaterRipple0, lvl.WaterRipple1].forEach(obj => obj.mixin(mxnSinePivot));
}
