import { wait } from "../../lib/game-engine/promise/wait";
import { container } from "../../lib/pixi/container";

async function myAsyncFunction(value?) {

}

export function objTest() {
    const data = {} as ImageData;
    const b = createImageBitmap;

    return container()
        .async(async () => {
            // await createImageBitmap(data);
            // await wait(() => true);
            // await myAsyncFunction().then(myAsyncFunction); // Tricky case!
            await myAsyncFunction().then(() => b(data)); // Also tricky case
            // await Promise.all([myAsyncFunction()]);
        })
}