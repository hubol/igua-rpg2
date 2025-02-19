import "../../src/lib/extensions/-load-extensions";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { Coro } from "../../src/lib/game-engine/routines/coro";
import { TickerContainer } from "../../src/lib/game-engine/ticker-container";
import { Assert } from "../lib/assert";
import { createDisplayObject } from "../lib/create-display-object";

export function coroWorks() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;
    let phase4 = false;

    const d = createDisplayObject().coro(
        function* () {
            yield () => phase1;
            phase = 1;
            yield () => phase2;
            phase = 2;
            yield () => phase3;
            phase = 3;
            yield () => phase4;
            phase = 4;
        },
    );

    c.addChild(d);

    phase1 = true;
    ticker.tick();

    Assert(phase).toStrictlyBe(1);

    phase2 = true;
    phase3 = true;
    ticker.tick();

    Assert(phase).toStrictlyBe(3);

    d.destroy();
    phase4 = true;
    ticker.tick();

    Assert(phase).toStrictlyBe(3);
}

export function coroAllWorks() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;

    let waitForPhase2Result = undefined;

    function* waitForPhase2() {
        yield () => phase2;
        return "hamburger";
    }

    const d = createDisplayObject().coro(
        function* () {
            const [_, result2] = yield* Coro.all([
                () => phase1,
                waitForPhase2(),
            ]);

            waitForPhase2Result = result2;

            phase = 2;
            yield () => phase3;
            phase = 3;
        },
    );

    c.addChild(d);

    phase1 = true;
    ticker.tick();

    Assert(phase).toStrictlyBe(0);

    phase2 = true;
    ticker.tick();

    Assert(phase).toStrictlyBe(2);

    phase3 = true;
    ticker.tick();

    Assert(phase).toStrictlyBe(3);

    d.destroy();
    ticker.tick();

    Assert(phase).toStrictlyBe(3);

    Assert(waitForPhase2Result).toStrictlyBe("hamburger");
}
