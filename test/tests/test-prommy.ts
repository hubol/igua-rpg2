import { Prommy, PrommyContext } from "../../src/lib/zone/prommy";
import { Assert } from "../lib/assert";

export async function testPrommy() {
    await Promise.all([
        sleep(150, 'abc').then(() => Assert(PrommyContext.current()).toStrictlyBe('abc')),
        sleep(60, 'def').then(() => Assert(PrommyContext.current()).toStrictlyBe('def')),
    ]);

    let loop1Finished = false;
    let loop2Finished = false;

    const loop1 = new Prommy(async (resolve) => {
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
            await sleep(50);
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
        }
        loop1Finished = true;
        resolve('loop1_Result');
    }, 'loop1');

    const loop2 = new Prommy(async (resolve) => {
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
            await sleep(90);
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
        }
        loop2Finished = true;
        resolve('loop2_Result');
    }, 'loop2');

    const results = await Promise.all([ loop1, loop2 ])

    Assert(results[0]).toStrictlyBe('loop1_Result');
    Assert(results[1]).toStrictlyBe('loop2_Result');

    Assert(loop1Finished).toBeTruthy();
    Assert(loop2Finished).toBeTruthy();

    Assert(PrommyContext.current()).toStrictlyBe(undefined);
}

function sleep(ms: number, context?: string) {
    return new Prommy(resolve => setTimeout(resolve, ms), context);
}