import { Environment } from "../../../lib/environment";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { playerObj } from "../obj-player";

export function objDevPlayer() {
    const obj = container();
    if (Environment.isDev) {
        obj.coro(function* () {
            yield sleepf(2);
            playerObj.at(obj);
        });
    }

    return obj;
}
