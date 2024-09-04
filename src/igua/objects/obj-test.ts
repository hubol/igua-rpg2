import { wait } from "../../lib/game-engine/promise/wait";
import { container } from "../../lib/pixi/container";

async function myAsyncFunction() {

}

export function objTest() {
    return container()
        .async(async () => {
            await wait(() => true);
            await myAsyncFunction();
            await myAsyncFunction().then(myAsyncFunction);
            await Promise.all([myAsyncFunction()]);
        })
}