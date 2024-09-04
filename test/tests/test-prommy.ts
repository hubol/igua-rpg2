import { Prommy, PrommyContext, _Internal_Prommy, installPrommy } from "../../src/lib/zone/prommy";
import { Assert } from "../lib/assert";
import { TestPromise } from "../lib/test-promise";

const { $p } = installPrommy();

export async function testPrommyTickingRejecting() {
    let loop1Finished = false;
    let loop2Finished = false;

    Prommy.createRoot(async () => {
        1;
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
            $p.$pop(await $p.$push(ticks(2)));
            if (i === 4) {
                $p.$pop(await $p.$push(rejectAfterTicks(2, 'get me out')));
                Assert('Should not reach here').toStrictlyBe(false);
            }
            console.log(PrommyContext.current(), 'shouldBe', 'loop1')
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
        }
        loop1Finished = true;
    }, 'loop1');

    Prommy.createRoot(async () => {
        2;
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
            $p.$pop(await $p.$push(ticks(3)));
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
        }
        loop2Finished = true;
    }, 'loop2');

    // Assert(PrommyContext.current()).toStrictlyBe(undefined);

    for (let i = 0; i < 200; i++) {
        tick();
        await TestPromise.flush();
    }

    Assert(loop1Finished).toStrictlyBe(false);
    Assert(loop2Finished).toBeTruthy();
}

export async function testPrommyTickingThrowing() {
    let loop1Finished = false;
    let loop1Partial = false;
    let loop2Finished = false;
    let loop3Finished = false;

    Prommy.createRoot(async () => {
        1;
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
            $p.$pop(await $p.$push(ticks(2)));
            if (i === 2) {
                Prommy.createRoot(async () => {
                    3;
                    for (let i = 0; i < 8; i++) {
                        Assert(PrommyContext.current()).toStrictlyBe('loop3');
                        $p.$pop(await $p.$push(ticks(3)));
                        Assert(PrommyContext.current()).toStrictlyBe('loop3');
                        $p.$pop(await $p.$push(ticks(3)));
                        Assert(PrommyContext.current()).toStrictlyBe('loop3');
                        $p.$pop(await $p.$push(ticks(3)));
                        Assert(PrommyContext.current()).toStrictlyBe('loop3');
                    }
                    loop3Finished = true;
                }, 'loop3');
            }
            if (i === 4) {
                loop1Partial = true;
                throw new Error('get me out');
            }
            console.log(PrommyContext.current(), 'shouldBe', 'loop1')
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
        }
        loop1Finished = true;
    }, 'loop1');

    Prommy.createRoot(async () => {
        2;
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
            $p.$pop(await $p.$push(ticks(3)));
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
        }
        loop2Finished = true;
    }, 'loop2');

    // Assert(PrommyContext.current()).toStrictlyBe(undefined);

    for (let i = 0; i < 200; i++) {
        tick();
        await TestPromise.flush();
    }

    Assert(loop1Finished).toStrictlyBe(false);
    Assert(loop1Partial).toBeTruthy();
    Assert(loop2Finished).toBeTruthy();
    Assert(loop3Finished).toBeTruthy();
}

export async function testPrommyTickingSimple() {
    let loop1Finished = false;
    let loop2Finished = false;

    Prommy.createRoot(async () => {
        1;
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
            $p.$pop(await $p.$push(ticks(1)));
            console.log(PrommyContext.current(), 'shouldBe', 'loop1')
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
        }
        loop1Finished = true;
    }, 'loop1');

    // Assert(PrommyContext.current()).toStrictlyBe(undefined);

    Prommy.createRoot(async () => {
        2;
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
            $p.$pop(await $p.$push(ticks(1)));
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
        }
        loop2Finished = true;
    }, 'loop2');

    // Assert(PrommyContext.current()).toStrictlyBe(undefined);

    for (let i = 0; i < 200; i++) {
        tick();
        await TestPromise.flush();
    }

    Assert(loop1Finished).toBeTruthy();
    Assert(loop2Finished).toBeTruthy();
}

function tick() {
    const entries = tickMap.entries();
    for (const [resolve, count] of entries) {
        if (count - 1 <= 0) {
            resolve();
            tickMap.delete(resolve);
        }
        else {
            tickMap.set(resolve, count - 1);
        }
    }
}

const tickMap: Map<Function, number> = new Map();

function ticks(count: number) {
    return _Internal_Prommy.create(resolve => {
        tickMap.set(resolve, count);
    });
}

function rejectAfterTicks(count: number, message: string) {
    return _Internal_Prommy.create((resolve, reject) => {
        tickMap.set(() => reject(message), count);
    });
}