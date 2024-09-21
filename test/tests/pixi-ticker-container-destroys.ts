import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { TickerContainer } from "../../src/lib/game-engine/ticker-container";
import { Assert } from "../lib/assert";

export function whenTickerContainerDestroyedStopsTicking() {
    const ticker1 = new AsshatTicker();
    const c1 = new TickerContainer(ticker1, false);

    const ticker2 = new AsshatTicker();
    const c2 = new TickerContainer(ticker2).show(c1);

    ticker1.tick();
    Assert(ticker2.ticks).toStrictlyBe(1);

    c2.destroy();
    ticker1.tick();
    Assert(ticker2.ticks).toStrictlyBe(1);
}

export function whenTickerContainerParentDestroyedStopsTicking() {
    const ticker1 = new AsshatTicker();
    const c1 = new TickerContainer(ticker1, false);

    const ticker2 = new AsshatTicker();
    const c2 = new TickerContainer(ticker2).show(c1);

    ticker1.tick();
    Assert(ticker2.ticks).toStrictlyBe(1);

    c1.destroy();
    ticker1.tick();
    Assert(ticker2.ticks).toStrictlyBe(1);
}
