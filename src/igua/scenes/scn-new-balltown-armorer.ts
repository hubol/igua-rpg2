import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../cutscene/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnNewBalltownArmorer() {
    Jukebox.play(Mzk.GolfResort);
    const lvl = Lvl.NewBalltownArmorer();
    enrichArmorer(lvl);
}

function enrichArmorer(lvl: ReturnType<typeof Lvl["NewBalltownArmorer"]>) {
    lvl.IguanaNpc.mixin(mxnCutscene, function* () {
        const result = yield* ask("What's going on?", "About zinc", "About fishtank", "Muddy house");
        if (result === 0) {
            yield* show("Zinc is an element that makes your loads bigger.");
        }
        else if (result === 1) {
            yield* show("Ah, my fishtank.", "I need water for it.");
        }
        else if (result === 2) {
            yield* show("You are judgmental, and in many ways a bitch.");
        }
    });
}
