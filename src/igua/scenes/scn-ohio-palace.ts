import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { vnew } from "../../lib/math/vector-type";
import { Jukebox } from "../core/igua-audio";
import { mxnEsotericPalaceHomunculus } from "../mixins/esoteric/mxn-esoteric-palace-homunculus";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objFxLight } from "../objects/effects/obj-fx-light";
import { playerObj } from "../objects/obj-player";

export function scnOhioPalace() {
    Jukebox.play(Mzk.SodaMachine);
    const lvl = Lvl.OhioPalace();
    lvl.WaterNpc
        .mixin(mxnEsotericPalaceHomunculus)
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                yield* self.mxnEsotericPalaceHomunculus.greet(
                    "Glub! Hello. Is there anything I can help with?",
                    "Nothing",
                );
            });
        });

    lvl.ForestNpc
        .mixin(mxnEsotericPalaceHomunculus)
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                yield* self.mxnEsotericPalaceHomunculus.greet("Bark! Hello. What do you want?", "Nothing");
            });
        });

    lvl.LightGroup
        .masked(objFxLight({ direction: vnew(0, 1), shadowCasterObjs: [playerObj, lvl.WaterNpc, lvl.ForestNpc] }))
        .alpha = 0.5;
}
