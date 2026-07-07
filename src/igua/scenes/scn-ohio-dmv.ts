import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaPlayerAttributes } from "../drama/drama-player-attributes";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnInteractChangePlayerAppearance } from "../mixins/mxn-interact-change-player-appearance";

export function scnOhioDmv() {
    const lvl = Lvl.OhioDmv();
    Jukebox.play(Mzk.NorthernCream);
    enrichDmvClerkNpc(lvl);

    lvl.Mirror
        .mixin(mxnInteractChangePlayerAppearance, { checkpointName: "fromAppearanceChange" });
}

function enrichDmvClerkNpc(lvl: LvlType.OhioDmv) {
    lvl.DmvClerkNpc
        .mixin(mxnCutscene, function* () {
            yield* DramaPlayerAttributes.chooseAvailableName();
        });
}
