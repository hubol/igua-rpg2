import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { mxnEsotericPalaceHomunculus } from "../mixins/esoteric/mxn-esoteric-palace-homunculus";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnIndianaPalace() {
    const lvl = Lvl.IndianaPalace();
    lvl.FlameNpc
        .mixin(mxnEsotericPalaceHomunculus)
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                yield* self.mxnEsotericPalaceHomunculus.greet("Whoosh! Hello. What can I do for you?", "Nothing");
            });
        });

    lvl.ForestNpc
        .mixin(mxnEsotericPalaceHomunculus)
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                yield* self.mxnEsotericPalaceHomunculus.greet("Ribbit! Hello. Do you need something?", "Nothing");
            });
        });
}
