import "../../src/lib/extensions/-load-extensions";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { createDisplayObject } from "../lib/create-display-object";
import { Assert } from "../lib/assert";
import { TestPromise } from "../lib/test-promise";
import { TickerContainer } from "../../src/lib/game-engine/ticker-container";
import { wait } from "../../src/lib/game-engine/promise/wait";
import { Prommy, PrommyContext } from "../../src/lib/zone/prommy";
import { merge } from "../../src/lib/object/merge";
import { AsshatZone } from "../../src/lib/game-engine/asshat-zone";
import { AsshatMicrotaskFactory } from "../../src/lib/game-engine/promise/asshat-microtasks";

merge(AsshatZone, {
    run(fn: () => unknown, context: any) {
        Prommy.createRoot<void>(async () => {
            try {
                const p = new Prommy<void>((resolve, reject) => {
                    const microtask = AsshatMicrotaskFactory.create(() => true, context, resolve as any, reject);
                    context.ticker.addMicrotask(microtask);
                });
                (globalThis.$prommyResult = await p, globalThis.$prommyPop(), globalThis.$prommyResult)
                await fn();
            }
            catch (e) {
                console.error(e);
            }
        }, context)
    }
})

export function requiresFlushingPromises() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;
    let phase4 = false;

    const d = createDisplayObject().named('requiresFlushingPromises').async(
        async () => {
            (globalThis.$prommyResult = await wait(() => phase1), globalThis.$prommyPop(), globalThis.$prommyResult)
            phase = 1;
            console.log('hi', phase);
            (globalThis.$prommyResult = await wait(() => phase2), globalThis.$prommyPop(), globalThis.$prommyResult)
            phase = 2;
            console.log('hi', phase);
            (globalThis.$prommyResult = await wait(() => phase3), globalThis.$prommyPop(), globalThis.$prommyResult)
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

export async function worksWithFlushingPromises1() {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker);

    let phase = 0;
    let phase1 = false;
    let phase2 = false;
    let phase3 = false;
    let phase4 = false;

    const d = createDisplayObject().named('worksWithFlushingPromises').async(
        async () => {
            console.log('hi');
            (globalThis.$prommyResult = await wait(() => phase1), globalThis.$prommyPop(), globalThis.$prommyResult)
            console.log('hi');
            phase = 1;
            (globalThis.$prommyResult = await wait(() => phase2), globalThis.$prommyPop(), globalThis.$prommyResult)
            phase = 2;
            (globalThis.$prommyResult = await wait(() => phase3), globalThis.$prommyPop(), globalThis.$prommyResult)
            phase = 3;
            (globalThis.$prommyResult = await wait(() => phase4), globalThis.$prommyPop(), globalThis.$prommyResult)
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
            (globalThis.$prommyResult = await Prommy.all([ wait(() => phase1), wait(() => phase2), ]), globalThis.$prommyPop(), globalThis.$prommyResult)
            phase = 2;
            (globalThis.$prommyResult = await wait(() => phase3), globalThis.$prommyPop(), globalThis.$prommyResult)
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

    const d = createDisplayObject().named('promiseLazyTickerWithFlushingPromises').async(
        async () => {
            (globalThis.$prommyResult = await Prommy.all([ wait(() => phase1), wait(() => phase2), ]), globalThis.$prommyPop(), globalThis.$prommyResult)
            phase = 2;
            (globalThis.$prommyResult = await wait(() => phase3), globalThis.$prommyPop(), globalThis.$prommyResult)
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
        .named('aPC1.obj1')
        .step(() => steps1++)
        .async(async () => {
            Assert(PrommyContext.current()).toStrictlyBe(obj1);
            (globalThis.$prommyResult = await wait(() => steps1 >= 3), globalThis.$prommyPop(), globalThis.$prommyResult)
            Assert(PrommyContext.current()).toStrictlyBe(obj1);
            obj1.destroy();
        })
        .show(c);

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    const obj2 = createDisplayObject();
    obj2
        .named('aPC1.obj2')
        .step(() => steps2++)
        .async(async () => {
            Assert(PrommyContext.current()).toStrictlyBe(obj2);
            (globalThis.$prommyResult = await wait(() => steps2 >= 2), globalThis.$prommyPop(), globalThis.$prommyResult)
            Assert(PrommyContext.current()).toStrictlyBe(obj2);
            obj2.destroy();
        })
        .show(c);

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    for (let i = 0; i < 7; i++) {
        ticker.tick();
        await TestPromise.flush();
    }

    // Assert(PrommyContext.current()).toStrictlyBe(undefined);

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
                (globalThis.$prommyResult = await wait(() => self.steps >= maxSteps), globalThis.$prommyPop(), globalThis.$prommyResult)
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

    // Assert(PrommyContext.current()).toStrictlyBe(undefined);

    let obj3: ObjIsolatedContext;
    let obj4: ObjIsolatedContext;

    for (let i = 0; i < 50; i++) {
        if (i === 30) {
            obj3 = objIsolatedContext(10);
            obj4 = objIsolatedContext(15);
        }

        // Assert(PrommyContext.current()).toStrictlyBe(undefined);

        ticker.tick();
        await TestPromise.flush();
    }

    Assert(obj4.steps).toStrictlyBe(15);
    Assert(obj3.steps).toStrictlyBe(10);
    Assert(obj2.steps).toStrictlyBe(30);
    Assert(obj1.steps).toStrictlyBe(40);
}
