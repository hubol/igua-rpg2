import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { DramaPlayerAttributes } from "../drama/drama-player-attributes";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnOhioDmv() {
    const lvl = Lvl.OhioDmv();
    enrichDmvClerkNpc(lvl);
}

function enrichDmvClerkNpc(lvl: LvlType.OhioDmv) {
    lvl.DmvClerkNpc
        .mixin(mxnCutscene, function* () {
            yield* DramaPlayerAttributes.chooseAvailableName();
        });
}
