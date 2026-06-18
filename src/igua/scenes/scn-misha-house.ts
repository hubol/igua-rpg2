import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnMishaHouse() {
    const lvl = Lvl.MishaHouse();

    lvl.MishaNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "I am very sad...",
                "Problems in production...",
            );
        });
}
