import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnNewBalltownUnderneath() {
    const lvl = Lvl.NewBalltownUnderneath();
    enrichHomeowner(lvl);
}

function enrichHomeowner(lvl: LvlType.NewBalltownUnderneath) {
    lvl.Homeowner.mixin(mxnCutscene, function* () {
        yield* show("Can you help? They took over my house :-(");
    });
}
