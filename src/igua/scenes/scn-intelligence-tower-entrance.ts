import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { mxnGift } from "../mixins/mxn-gift";

export function scnIntelligenceTowerEntrance() {
    const lvl = Lvl.IntelligenceTowerEntrance();
    lvl.Gift.mixin(mxnGift, "Ohio.IntelligenceTower.Entrance.Gift");
}
