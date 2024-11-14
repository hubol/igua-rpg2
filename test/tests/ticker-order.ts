import { AsshatTaskContext, AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { CancellationToken } from "../../src/lib/promise/cancellation-token";
import { Assert } from "../lib/assert";

export function tickerOrderWorksAsExpected() {
    const ticker = new AsshatTicker();

    const result: number[] = [];

    const context: AsshatTaskContext = { cancellationToken: new CancellationToken() };

    ticker.add({ fn: () => result.push(1), context }, 1);
    ticker.add({ fn: () => result.push(-1), context }, -1);
    ticker.add({ fn: () => result.push(0), context }, 0);

    ticker.tick();

    Assert(result.length).toStrictlyBe(3);
    Assert(result[0]).toStrictlyBe(-1);
    Assert(result[1]).toStrictlyBe(0);
    Assert(result[2]).toStrictlyBe(1);
}
