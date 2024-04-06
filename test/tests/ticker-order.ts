import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { Undefined } from "../../src/lib/types/undefined";
import { Assert } from "../lib/assert";

export function tickerOrderWorksAsExpected() {
    const ticker = new AsshatTicker();

    const result: number[] = [];

    ticker.add(() => result.push(1), 1);
    ticker.add(() => result.push(-1), -1);
    ticker.add(() => result.push(0), 0);

    ticker.tick();

    Assert(result.length).toStrictlyBe(3);
    Assert(result[0]).toStrictlyBe(-1);
    Assert(result[1]).toStrictlyBe(0);
    Assert(result[2]).toStrictlyBe(1);
}