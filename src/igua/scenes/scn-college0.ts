import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { DramaClassroom } from "../drama/drama-classroom";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnCollege0() {
    const lvl = Lvl.College0();
    lvl.Podium.mixin(mxnCutscene, function* () {
        yield* DramaClassroom.teach("college0");
    });
}
