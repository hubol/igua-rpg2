import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { show } from "../cutscene/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnNewBalltownArmorer() {
    Jukebox.play(Mzk.GolfResort);
    const lvl = Lvl.NewBalltownArmorer();
    enrichArmorer(lvl);
}

function enrichArmorer(lvl: ReturnType<typeof Lvl["NewBalltownArmorer"]>) {
    lvl.IguanaNpc.mixin(mxnCutscene, function* () {
        yield* show("Sup");
    });
}
