import { Sprite } from "pixi.js";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { range } from "../../../lib/range";
import { DramaFlops } from "../../drama/drama-flops";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { objCharacterBoxer } from "../../objects/characters/obj-character-boxer";

export function scnDevDramaFlops() {
    const lvl = Lvl.Dummy();
    objCharacterBoxer()
        .at(lvl.DummyMarker)
        .mixin(mxnCutscene, function* () {
            yield* DramaFlops.askFlop(range(1000).map(() => Rng.float() > 0.8));
        })
        .show();
}
