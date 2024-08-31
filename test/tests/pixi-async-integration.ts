import "../../src/lib/extensions/-load-extensions";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { createDisplayObject } from "../lib/create-display-object";
import { Assert } from "../lib/assert";
import { TestPromise } from "../lib/test-promise";
import { TickerContainer } from "../../src/lib/game-engine/ticker-container";
import { wait } from "../../src/lib/game-engine/promise/wait";
import { PrommyContext } from "../../src/lib/zone/prommy";

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

export async function asyncPrommyContext1() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let steps1 = 0;
    let steps2 = 0;

    const obj1 = createDisplayObject();
    obj1
        .step(() => steps1++)
        .async(async () => {
            Assert(PrommyContext.current()).toStrictlyBe(obj1);
            await wait(() => steps1 >= 3);
            Assert(PrommyContext.current()).toStrictlyBe(obj1);
            obj1.destroy();
        })
        .show(c);

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    const obj2 = createDisplayObject();
    obj2
        .step(() => steps2++)
        .async(async () => {
            Assert(PrommyContext.current()).toStrictlyBe(obj2);
            await wait(() => steps2 >= 2);
            Assert(PrommyContext.current()).toStrictlyBe(obj2);
            obj2.destroy();
        })
        .show(c);

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    for (let i = 0; i < 7; i++) {
        ticker.tick();
        await TestPromise.flush();
    }

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    Assert(steps1).toStrictlyBe(3);
    Assert(steps2).toStrictlyBe(2);
}

export async function asyncPrommyContext2() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    const objIsolatedContext = (maxSteps: number) => {
        const obj = createDisplayObject();
        return obj
            .named('Obj' + maxSteps)
            .merge({ steps: 0 })
            .step(self => self.steps++)
            .async(async self => {
                Assert(PrommyContext.current()?.name).toStrictlyBe(obj.name);
                await wait(() => self.steps >= maxSteps);
                if (PrommyContext.current()?.name !== obj.name)
                    console.log('Gonna throw because assert fails: ' + PrommyContext.current()?.name + ' !== ' + obj.name);
                Assert(PrommyContext.current()?.name).toStrictlyBe(obj.name);
                obj.destroy();
            })
            .show(c)
            .once('destroyed', () => console.log(`${obj.name} destroyed`));
    }

    type ObjIsolatedContext = ReturnType<typeof objIsolatedContext>;

    const obj1 = objIsolatedContext(40);
    const obj2 = objIsolatedContext(30);

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    let obj3: ObjIsolatedContext;
    let obj4: ObjIsolatedContext;

    for (let i = 0; i < 50; i++) {
        if (i === 30) {
            obj3 = objIsolatedContext(10);
            obj4 = objIsolatedContext(15);
        }

        // if (PrommyContext.current()) {
        //     console.log(PrommyContext.current()?.name);
        //     console.log(obj2.destroyed);
        // }
        // Assert(PrommyContext.current()).toStrictlyBe(undefined);

        ticker.tick();
        await TestPromise.flush();
    }

    Assert(obj4.steps).toStrictlyBe(15);
    Assert(obj3.steps).toStrictlyBe(10);
    Assert(obj2.steps).toStrictlyBe(30);
    Assert(obj1.steps).toStrictlyBe(40);
}
// TODO test siblings with async
// against prommy