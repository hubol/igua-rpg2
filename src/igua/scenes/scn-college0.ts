import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { ForceTintFilter } from "../../lib/pixi/filters/force-tint-filter";
import { Jukebox } from "../core/igua-audio";
import { DramaClassroom } from "../drama/drama-classroom";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";

export function scnCollege0() {
    Jukebox.play(Mzk.DespicableMessage);
    const lvl = Lvl.College0();
    lvl.Podium.mixin(mxnCutscene, function* () {
        yield* DramaClassroom.teach("college0");
    });
    enrichDistantAngel(lvl);
}

function enrichDistantAngel(lvl: LvlType.College0) {
    if (Rng.float() < 0.3) {
        return;
    }
    lvl.DistantAngel
        .filtered(new ForceTintFilter(0x98c8ae, 0.5))
        .mixin(mxnSinePivot)
        .coro(function* (self) {
            yield sleep(5000);
            yield interpvr(self).factor(factor.sine).to(lvl.DistantAngelTarget).over(7000);
        });
}
