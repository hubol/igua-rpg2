import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnGift } from "../mixins/mxn-gift";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { Search } from "../utils/search";

export function scnIntelligenceTowerEntrance() {
    const lvl = Lvl.IntelligenceTowerEntrance();
    lvl.Gift.mixin(mxnGift, "Ohio.IntelligenceTower.Entrance.Gift");
    lvl.WaterGroup.mixin(mxnSinePivot);
    Search.findDecals(Tx.Shapes.DashedLine3px)
        .forEach(obj => obj.mixin(mxnBoilPivot));
}
