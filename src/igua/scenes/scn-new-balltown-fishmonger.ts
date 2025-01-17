import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { objFish } from "../objects/obj-fish";

export function scnNewBalltownFishmonger() {
    Jukebox.play(Mzk.BreadCrumbPool);
    const lvl = Lvl.NewBalltownFishmonger();
    enrichAquarium(lvl);
}

function enrichAquarium(lvl: ReturnType<typeof Lvl["NewBalltownFishmonger"]>) {
    for (const fishMarker of [lvl.Fish0, lvl.Fish1, lvl.Fish2]) {
        objFish(fishMarker.x * 9999 + fishMarker.y * 8888 + 800_903).at(fishMarker).show();
    }

    lvl.WaterLineTop.mixin(mxnBoilPivot);
}
