import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { vnew } from "../../lib/math/vector-type";
import { Jukebox } from "../core/igua-audio";
import { mxnEsotericPalaceHomunculus } from "../mixins/esoteric/mxn-esoteric-palace-homunculus";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objFxLight } from "../objects/effects/obj-fx-light";
import { playerObj } from "../objects/obj-player";

export function scnIndianaPalace() {
    Jukebox.play(Mzk.SodaMachine);
    const lvl = Lvl.IndianaPalace();
    lvl.FlameNpc
        .mixin(mxnEsotericPalaceHomunculus, {
            progressKey: "indiana",
            kind: "key_locations",
            hintIds: ["Indiana.MagicKey0", "Indiana.MagicKey1", "Indiana.MagicKey2", "Indiana.MagicKey3"],
        })
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                yield* self.mxnEsotericPalaceHomunculus.greet("Meow! Hello. What can I do for you?", "Nothing");
            });
        });

    lvl.LightNpc
        .mixin(mxnEsotericPalaceHomunculus, {
            progressKey: "indiana",
            kind: "hall_location",
            messages: ["The crystall hall is located in the cavern below the Red Plains."],
        })
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                yield* self.mxnEsotericPalaceHomunculus.greet("Hoot! Hello. Do you need something?", "Nothing");
            });
        });

    lvl.LightGroup
        .masked(objFxLight({ direction: vnew(0, 1), shadowCasterObjs: [playerObj, lvl.FlameNpc, lvl.LightNpc] }))
        .alpha = 0.5;
}
