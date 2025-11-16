import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnWeightedPedestalMask } from "../mixins/mxn-weighted-pedestal-mask";

export function scnSimpleSecretValuables() {
    Jukebox.play(Mzk.SharedBaby);
    const lvl = Lvl.SimpleSecretValuables();
    enrichPedestal(lvl);
    enrichNpc(lvl);
    [lvl.CloudsGroup0, lvl.CloudsGroup1, lvl.CloudsGroup2].forEach(obj => obj.mixin(mxnSinePivot));
    lvl.BehindHubolGroup.children.forEach(obj => obj.mixin(mxnSinePivot));
}

function enrichPedestal(lvl: LvlType.SimpleSecretValuables) {
    lvl.WeightedPedestal.mixin(mxnWeightedPedestalMask, {
        terrainObjs: [lvl.PedestalBlock0, lvl.PedestalBlock1],
        decalObjs: [lvl.PedestalFlopGroup],
        maskWhenWeighted: false,
    });
}

function enrichNpc(lvl: LvlType.SimpleSecretValuables) {
    lvl.IguanaNpc.mixin(mxnCutscene, function* () {
        yield* show(
            "Creating things is so important to me.",
            "When I don't get to make something for a while, I get restless.",
            "I find it difficult to relax.",
            "It's hard to find the balance.",
            "I hope that I will find peace when I am older.",
        );
    });
}
