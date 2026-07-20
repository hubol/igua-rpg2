import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Tx } from "../../assets/textures";
import { Jukebox } from "../core/igua-audio";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnGift } from "../mixins/mxn-gift";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { Search } from "../utils/search";

export function scnIntelligenceTowerEntrance() {
    Jukebox.play(Mzk.RochesterDetour);
    const lvl = Lvl.IntelligenceTowerEntrance();
    lvl.Gift.mixin(mxnGift, "Ohio.IntelligenceTower.Entrance.Gift");
    lvl.WaterGroup.mixin(mxnSinePivot);
    Search.findDecals(Tx.Shapes.DashedLine3px)
        .forEach(obj => obj.mixin(mxnBoilPivot));
}
