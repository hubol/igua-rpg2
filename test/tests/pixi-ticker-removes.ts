import "../../src/lib/extensions/-load-extensions";
import { Container } from "pixi.js";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { TickerContainer } from "../../src/lib/game-engine/ticker-container";
import { Assert } from "../lib/assert";
import { createDisplayObject } from "../lib/create-display-object";

export function grandchildStopsTicking() {
    const ticker = new AsshatTicker();
    const tc = new TickerContainer(ticker);

    let ticks = 0;

    const c1 = new Container();
    const c2 = new Container();
    const d = createDisplayObject()
        .step(() => ticks += 1)
        .show(c2);

    c2.show(c1);
    c1.show(tc);

    ticker.tick();
    Assert(ticks).toStrictlyBe(1);
    Assert(d.ticker).toStrictlyBe(ticker);

    tc.destroy();

    ticker.tick();
    Assert(ticks).toStrictlyBe(1);
}
