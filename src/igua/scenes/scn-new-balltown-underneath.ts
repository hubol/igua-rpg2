import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnNewBalltownUnderneath() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.NewBalltownUnderneath();
    enrichHomeowner(lvl);
}

function enrichHomeowner(lvl: LvlType.NewBalltownUnderneath) {
    lvl.Homeowner.mixin(mxnCutscene, function* () {
        yield* show("Can you help? They took over my house :-(");
    });
}
