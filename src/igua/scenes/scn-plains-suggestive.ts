import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { mxnWeightedPedestalMask } from "../mixins/mxn-weighted-pedestal-mask";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnPlainsSuggestive() {
    Jukebox.play(Mzk.HomeFine);
    const lvl = Lvl.PlainsSuggestive();
    // playerObj.coro(function* () {
    //     yield sleepf(3);
    //     playerObj.at(lvl.test);
    // });
    // Rpg.inventory.equipment.receive("IqIndicator");

    enrichDevilBoneMan(lvl);
    enrichWeightedPedestal(lvl);
}

function enrichWeightedPedestal(lvl: LvlType.PlainsSuggestive) {
    lvl.WeightedPedestal.mixin(mxnWeightedPedestalMask, {
        interactObjs: [lvl.PedestalSign],
        terrainObjs: [lvl.PedestalBlock0],
        decalObjs: [lvl.PedestalTerrainGroup],
    });
}

function enrichDevilBoneMan(lvl: LvlType.PlainsSuggestive) {
    lvl.DevilBoneManHead.mixin(mxnBoilPivot);

    lvl.DevilBoneManGroup
        .mixin(mxnSpeaker, { name: "DevilBoneMan", colorPrimary: 0x1ACC1D, colorSecondary: 0xB396CC })
        .mixin(mxnCutscene, function* () {
            yield* show(
                "You must be smart.",
                "I don't need very much money to get by.",
                "Maybe you want something.",
            );

            // TODO at least the names should match speaker...
            yield* dramaShop("SuggestiveSecret", { primaryTint: 0x783289, secondaryTint: 0xB396CC });
        });
}
