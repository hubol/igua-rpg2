import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaLib } from "../drama/drama-lib";
import { DramaPlayerAttributes } from "../drama/drama-player-attributes";
import { ask, show } from "../drama/show";
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
            const result = yield* ask(
                "Welcome to the Ohio DMV. How can I help you?",
                "Change my name",
                "It is impossible\nto help me",
            );

            if (result === 1) {
                yield* show("OK. Dramatic.");
                return;
            }

            yield* DramaPlayerAttributes.chooseAvailableName();
        });
}
