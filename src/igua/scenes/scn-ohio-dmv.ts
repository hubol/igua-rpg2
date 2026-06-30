import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { DramaPlayerAttributes } from "../drama/drama-player-attributes";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnInteractChangePlayerAppearance } from "../mixins/mxn-interact-change-player-appearance";

export function scnOhioDmv() {
    const lvl = Lvl.OhioDmv();
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
