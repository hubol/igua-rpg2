import { Prommy, PrommyContext } from "../../src/lib/zone/prommy";
import { Assert } from "../lib/assert";
import { TestPromise } from "../lib/test-promise";

export async function morePrommyAndChainingWorks() {

}

export async function morePrommyAllWorks() {

}

async function returnsPromisePrommy() {
    console.log('a');
    (globalThis.$prommyResult = await ticks(2), globalThis.$prommyPop(), globalThis.$prommyResult)
    console.log('b');
    (globalThis.$prommyResult = await ticks(2), globalThis.$prommyPop(), globalThis.$prommyResult)
}

export async function morePrommyUtilityFunctionWorks() {
    let finished1 = false;
    let finished2 = false;

    Prommy.createRoot(async () => {
        Assert(PrommyContext.current()).toStrictlyBe('root1');
        (globalThis.$prommyResult = await new Prommy(returnsPromisePrommy()), globalThis.$prommyPop(), globalThis.$prommyResult)
        // await returnsPromisePrommy();
        Assert(PrommyContext.current()).toStrictlyBe('root1');
        (globalThis.$prommyResult = await new Prommy(returnsPromisePrommy()), globalThis.$prommyPop(), globalThis.$prommyResult)
        Assert(PrommyContext.current()).toStrictlyBe('root1');
        finished1 = true;
    }, 'root1');

    Prommy.createRoot(async () => {
        Assert(PrommyContext.current()).toStrictlyBe('root2');
        // TODO this transformation needs to happen in TSvvvvvvvv
        (globalThis.$prommyResult = await new Prommy(returnsPromisePrommy()), globalThis.$prommyPop(), globalThis.$prommyResult)
        Assert(PrommyContext.current()).toStrictlyBe('root2');
        (globalThis.$prommyResult = await new Prommy(returnsPromisePrommy()), globalThis.$prommyPop(), globalThis.$prommyResult)
        Assert(PrommyContext.current()).toStrictlyBe('root2');
        finished2 = true;
    }, 'root2');

    for (let i = 0; i < 30; i++) {
        tick();
        await TestPromise.flush();
    }

    Assert(finished1).toBeTruthy();
    Assert(finished2).toBeTruthy();
    Assert(PrommyContext._internalStackLength).toStrictlyBe(0);
}

function tick() {
    const entries = tickMap.entries();
    for (const [callback, count] of entries) {
        if (count - 1 <= 0) {
            callback();
            tickMap.delete(callback);
        }
        else {
            tickMap.set(callback, count - 1);
        }
    }
}

const tickMap: Map<Function, number> = new Map();

function ticks(count: number) {
    return new Prommy(resolve => {
        tickMap.set(resolve, count);
    });
}
