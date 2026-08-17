import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";

export function scnOhioCemetery() {
    const lvl = Lvl.OhioCemetery();
    lvl.WaterGroup
        .children
        .forEach(obj => obj.mixin(mxnSinePivot));
}
