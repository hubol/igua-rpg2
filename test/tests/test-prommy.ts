import { Prommy, PrommyContext } from "../../src/lib/zone/prommy";
import { Assert } from "../lib/assert";

export async function testPrommy() {
    let loop1Finished = false;
    let loop2Finished = false;
    let loop3Finished = false;

    const loop1 = Prommy.createRoot(async () => {
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
            await sleep(50);
            Assert(PrommyContext.current()).toStrictlyBe('loop1');
        }
        loop1Finished = true;
        return 'loop1_Result';
    }, 'loop1');

    const loop2 = Prommy.createRoot(async () => {
        for (let i = 0; i < 8; i++) {
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
            await sleep(90);
            if (i === 4) {
                loop3 = Prommy.createRoot(async () => {
                    for (let i = 0; i < 8; i++) {
                        Assert(PrommyContext.current()).toStrictlyBe('loop3');
                        await sleep(90);
                        Assert(PrommyContext.current()).toStrictlyBe('loop3');
                    }
                    loop3Finished = true;
                    return 'loop3_Result';
                }, 'loop3');
            }
            Assert(PrommyContext.current()).toStrictlyBe('loop2');
        }
        loop2Finished = true;
        return 'loop2_Result';
    }, 'loop2');

    let loop3: Prommy<string>;

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    const results = await Promise.all([ loop1, loop2 ]);

    Assert(results[0]).toStrictlyBe('loop1_Result');
    Assert(results[1]).toStrictlyBe('loop2_Result');

    Assert(PrommyContext.current()).toStrictlyBe(undefined);

    Assert(await loop3).toStrictlyBe('loop3_Result');

    Assert(loop1Finished).toBeTruthy();
    Assert(loop2Finished).toBeTruthy();
    Assert(loop3Finished).toBeTruthy();

    Assert(PrommyContext.current()).toStrictlyBe(undefined);
}

export async function testPrommyThrowingDoesNotBleedContext() {
    try {
        await Prommy.createRoot(async () => {
            await sleep(40);
            throw new Error('wtf!!!');
        }, 'asdf');

        Assert(false).toBeTruthy();
    }
    catch (e) {
        Assert(e.message).toStrictlyBe('wtf!!!');
        Assert(PrommyContext.current()).toStrictlyBe(undefined);
    }
}

export async function testPrommyAll() {
    const root1 = Prommy.createRoot(async () => {
        await Promise.all([
            sleep(30).then(() => Assert(PrommyContext.current()).toStrictlyBe('root1')),
            sleep(90).then(() => Assert(PrommyContext.current()).toStrictlyBe('root1')),
            sleep(60).then(() => Assert(PrommyContext.current()).toStrictlyBe('root1')),
        ])
    }, 'root1');

    const root2 = Prommy.createRoot(async () => {
        await Promise.all([
            sleep(30).then(() => Assert(PrommyContext.current()).toStrictlyBe('root2')),
            sleep(90).then(() => Assert(PrommyContext.current()).toStrictlyBe('root2')),
            sleep(60).then(() => Assert(PrommyContext.current()).toStrictlyBe('root2')),
        ])
    }, 'root2');

    await Promise.all([ root1, root2 ]);
}

export async function testPrommyRace() {
    const root1 = Prommy.createRoot(async () => {
        await Promise.race([
            sleep(30).then(() => Assert(PrommyContext.current()).toStrictlyBe('root1')),
            sleep(90).then(() => Assert(PrommyContext.current()).toStrictlyBe('root1')),
            sleep(60).then(() => Assert(PrommyContext.current()).toStrictlyBe('root1')),
        ])
    }, 'root1');

    const root2 = Prommy.createRoot(async () => {
        await Promise.race([
            sleep(30).then(() => Assert(PrommyContext.current()).toStrictlyBe('root2')),
            sleep(90).then(() => Assert(PrommyContext.current()).toStrictlyBe('root2')),
            sleep(60).then(() => Assert(PrommyContext.current()).toStrictlyBe('root2')),
        ])
    }, 'root2');

    await Promise.all([ root1, root2 ]);
}

function sleep(ms: number) {
    return new Prommy(resolve => setTimeout(resolve, ms));
}