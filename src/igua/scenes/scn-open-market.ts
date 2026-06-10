import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { mxnYell } from "../mixins/mxn-yell";

export function scnOpenMarket() {
    const lvl = Lvl.OpenMarket();
    lvl.MarketNpc0
        .mixin(mxnYell)
        .coro(function* (self) {
            while (true) {
                self.mxnYell.yell("Hello!");
                yield sleep(3000);
            }
        });
}
