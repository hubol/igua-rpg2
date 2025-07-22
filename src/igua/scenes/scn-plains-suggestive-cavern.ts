import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnPlainsSuggestiveCavern() {
    const lvl = Lvl.PlainsSuggestiveCavern();
    enrichGatekeeper(lvl);
}

function enrichGatekeeper(lvl: LvlType.PlainsSuggestiveCavern) {
    let opening = false;

    lvl.Gatekeeper.mixin(mxnCutscene, function* () {
        if (!opening) {
            if (yield* ask("Ready to go?")) {
                lvl.MovingCeilingBlock.coro(function* (self) {
                    yield interpvr(self).factor(factor.sine).translate(self.width, 0).over(20_000);
                });
                opening = true;

                yield* show("OK! See ya!");
                return;
            }

            yield* show("Let me know if you change your mind.");
            return;
        }

        yield* show("Please proceed upwards to leave.");
    });
}
