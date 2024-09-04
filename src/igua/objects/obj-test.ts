import { wait } from "../../lib/game-engine/promise/wait";
import { container } from "../../lib/pixi/container";

async function myAsyncFunction() {

}

export function objTest() {
    const b = myAsyncFunction;

    return container()
        .async(async () => {
            await wait(() => true);
            await myAsyncFunction().then(myAsyncFunction); // Tricky case!
            await myAsyncFunction().then(b); // Also tricky case
            await Promise.all([myAsyncFunction()]);
        })
}