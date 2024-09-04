import { Prommy, PrommyContext, installPrommy } from "../../src/lib/zone/prommy";
import { Assert } from "../lib/assert";
import { TestPromise } from "../lib/test-promise";

const { $p } = installPrommy();

export async function morePrommyThenChainingWorks() {
    const events: string[] = [];

    Prommy.createRoot(async () => {
        Assert(PrommyContext.current()).toStrictlyBe('rootA');
        $p.$pop(await $p.$push(asyncFunction().then(() => {
            Assert(PrommyContext.current()).toStrictlyBe('rootA');
            events.push('a');
        })));
        Assert(PrommyContext.current()).toStrictlyBe('rootA');
        $p.$pop(await $p.$push(asyncFunction().then(() => {
            Assert(PrommyContext.current()).toStrictlyBe('rootA');
            events.push('c');
        }).then(() => {
            Assert(PrommyContext.current()).toStrictlyBe('rootA');
            return ticks(10);
        })));
        Assert(PrommyContext.current()).toStrictlyBe('rootA');
        events.push('e');
    }, 'rootA');

    Prommy.createRoot(async () => {
        Assert(PrommyContext.current()).toStrictlyBe('rootB');
        $p.$pop(await $p.$push(asyncFunction().then(() => {
            Assert(PrommyContext.current()).toStrictlyBe('rootB');
            return ticks(2);
        }).then(() => events.push('b'))));
        Assert(PrommyContext.current()).toStrictlyBe('rootB');
        $p.$pop(await $p.$push(asyncFunction()));
        Assert(PrommyContext.current()).toStrictlyBe('rootB');
        events.push('d');
    }, 'rootB');

    for (let i = 0; i < 30; i++) {
        tick();
        await TestPromise.flush();
    }

    Assert(events.length).toStrictlyBe(5);
    Assert(events[0]).toStrictlyBe('a');
    Assert(events[1]).toStrictlyBe('b');
    Assert(events[2]).toStrictlyBe('c');
    Assert(events[3]).toStrictlyBe('d');
    Assert(events[4]).toStrictlyBe('e');
}

export async function morePrommyAllWorks() {

}

async function asyncFunction() {
    const initialContext = PrommyContext.current();
    console.log(initialContext);
    Assert(PrommyContext.current()).toBeTruthy();
    $p.$pop(await $p.$push(ticks(2)));
    Assert(PrommyContext.current()).toStrictlyBe(initialContext);
    $p.$pop(await $p.$push(ticks(2)));
    Assert(PrommyContext.current()).toStrictlyBe(initialContext);
    return 3;
}

export async function morePrommyUtilityFunctionWorks() {
    let finished1 = false;
    let finished2 = false;

    Prommy.createRoot(async () => {
        Assert(PrommyContext.current()).toStrictlyBe('root1');
        $p.$pop(await $p.$push(asyncFunction()));
        Assert(PrommyContext.current()).toStrictlyBe('root1');
        $p.$pop(await $p.$push(asyncFunction()));
        Assert(PrommyContext.current()).toStrictlyBe('root1');
        finished1 = true;
    }, 'root1');

    Prommy.createRoot(async () => {
        Assert(PrommyContext.current()).toStrictlyBe('root2');
        // TODO this transformation needs to happen in TSvvvvvvvv
        $p.$pop(await $p.$push(asyncFunction()));
        Assert(PrommyContext.current()).toStrictlyBe('root2');
        $p.$pop(await $p.$push(asyncFunction()));
        Assert(PrommyContext.current()).toStrictlyBe('root2');
        finished2 = true;
    }, 'root2');

    for (let i = 0; i < 30; i++) {
        tick();
        await TestPromise.flush();
    }

    Assert(finished1).toBeTruthy();
    Assert(finished2).toBeTruthy();
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
    return Prommy.create(resolve => {
        tickMap.set(() => resolve(count), count);
    });
}
