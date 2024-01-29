import "../../src/lib/extensions";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { createDisplayObject } from "../lib/create-display-object";
import { Assert } from "../lib/assert";
import { TestPromise } from "../lib/test-promise";
import { TickerContainer } from "../../src/lib/game-engine/ticker-container";
import { wait } from "../../src/lib/game-engine/promise/wait";

export function requiresFlushingPromises() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;
    let phase4 = false;

    const d = createDisplayObject().async(
        async () => {
            await wait(() => phase1);
            phase = 1;
            console.log('hi', phase);
            await wait(() => phase2);
            phase = 2;
            console.log('hi', phase);
            await wait(() => phase3);
            phase = 3;
            console.log('hi', phase);
        });
    
    c.addChild(d);

    Assert(phase).toStrictlyBe(0);
    ticker.tick();
    Assert(phase).toStrictlyBe(0);
    phase1 = true;
    ticker.tick();
    Assert(phase).toStrictlyBe(0);
    phase2 = true;
    phase3 = true;
    ticker.tick();
    Assert(phase).toStrictlyBe(0);
    phase4 = true;
    ticker.tick();
    Assert(phase).toStrictlyBe(0);
}

export async function worksWithFlushingPromises() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;
    let phase4 = false;

    const d = createDisplayObject().async(
        async () => {
            await wait(() => phase1);
            phase = 1;
            await wait(() => phase2);
            phase = 2;
            await wait(() => phase3);
            phase = 3;
            await wait(() => phase4);
            phase = 4;
        });
    
    c.addChild(d);

    ticker.tick();
    phase1 = true;
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(1);

    phase2 = true;
    phase3 = true;
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(3);

    
    d.destroy();
    phase4 = true;
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(3);
}

export async function promiseAllWorksWithFlushingPromises() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;

    const d = createDisplayObject().async(
        async () => {
            await Promise.all([
                wait(() => phase1),
                wait(() => phase2),
            ]);
            phase = 2;
            await wait(() => phase3);
            phase = 3;
        });
    
    c.addChild(d);

    ticker.tick();
    phase1 = true;
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(0);

    phase2 = true;
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(2);

    phase3 = true;
    ticker.tick();
    
    await TestPromise.flush();
    Assert(phase).toStrictlyBe(3);
    
    d.destroy();
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(3);
}

export async function promiseLazyTickerWithFlushingPromises() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;

    const d = createDisplayObject().async(
        async () => {
            await Promise.all([
                wait(() => phase1),
                wait(() => phase2),
            ]);
            phase = 2;
            await wait(() => phase3);
            phase = 3;
        });
    
    c.addChild(d);

    ticker.tick();
    phase1 = true;
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(0);

    phase2 = true;
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(2);

    phase3 = true;
    ticker.tick();
    
    await TestPromise.flush();
    Assert(phase).toStrictlyBe(3);
    
    d.destroy();
    ticker.tick();

    await TestPromise.flush();
    Assert(phase).toStrictlyBe(3);
}