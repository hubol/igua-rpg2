import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaCostco } from "../drama/drama-costco";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnOhioCostco() {
    Jukebox.play(Mzk.DealsFantastico);
    const lvl = Lvl.OhioCostco();
    enrichGreeterNpc(lvl);
}

function enrichGreeterNpc(lvl: LvlType.OhioCostco) {
    let isOpened = false;

    lvl.GreeterNpc
        .mixin(mxnCutscene, function* () {
            if (isOpened) {
                yield* show(
                    "Enjoy Costco Wholesale!!!",
                    "Eat a hot dog or summ'n!!!",
                );
                return;
            }

            isOpened = yield* DramaCostco.checkMembership();
        });

    lvl.GreeterBlock
        .coro(function* (self) {
            yield () => isOpened;
            let stepsCount = 0;
            const x = self.x;
            self.step(() => {
                self.x = Math.round(x + Math.sin(stepsCount++ / 15) * 10);
                self.y -= 1;
            });
        });
}
