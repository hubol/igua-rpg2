import "../../src/lib/extensions";
import { Container } from "pixi.js";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { createDisplayObject } from "../lib/create-display-object";
import { wait } from "../../src/lib/game-engine/wait";
import { Assert } from "../lib/assert";
import { TestPromise } from "../lib/test-promise";

export function worksReally() {
    const ticker = new AsshatTicker();
    const c = new Container().withTicker(ticker);

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
    ticker.update();
    Assert(phase).toStrictlyBe(0);
    phase1 = true;
    ticker.update();
    // Assert(phase).toStrictlyBe(1);
    phase2 = true;
    phase3 = true;
    ticker.update();
    // Assert(phase).toStrictlyBe(3);
    phase4 = true;
    ticker.update();
    Assert(phase).toStrictlyBe(4);
}

export async function worksKinda() {
    const ticker = new AsshatTicker();
    const c = new Container().withTicker(ticker);

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

    ticker.update();
    phase1 = true;
    ticker.update();

    await TestPromise.sleep(1);
    Assert(phase).toStrictlyBe(1);

    phase2 = true;
    phase3 = true;
    ticker.update();

    await TestPromise.sleep(1);
    Assert(phase).toStrictlyBe(3);

    
    phase4 = true;
    ticker.update();

    await TestPromise.sleep(1);
    Assert(phase).toStrictlyBe(4);
}