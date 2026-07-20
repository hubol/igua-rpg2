import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaLib } from "../drama/drama-lib";
import { DramaPlayerAttributes } from "../drama/drama-player-attributes";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnInteractChangePlayerAppearance } from "../mixins/mxn-interact-change-player-appearance";
import { mxnSpeaker } from "../mixins/mxn-speaker";

export function scnOhioDmv() {
    DramaLib.Speaker.isDarkMode = true;
    const lvl = Lvl.OhioDmv();
    Jukebox.play(Mzk.NorthernCream);
    enrichDmvClerkNpc(lvl);

    lvl.Mirror
        .mixin(mxnSpeaker, { name: "Ritual Mirror", tintPrimary: 0xff0000, tintSecondary: 0x000000 })
        .mixin(mxnInteractChangePlayerAppearance, { checkpointName: "fromAppearanceChange" });
}

function enrichDmvClerkNpc(lvl: LvlType.OhioDmv) {
    lvl.DmvClerkNpc
        .mixin(mxnCutscene, function* () {
            yield* DramaPlayerAttributes.chooseAvailableName();
        });
}
