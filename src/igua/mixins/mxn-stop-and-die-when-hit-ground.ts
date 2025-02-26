import { sleep } from "../../lib/game-engine/routines/sleep";
import { MxnPhysics } from "./mxn-physics";

export function mxnStopAndDieWhenHitGround(obj: MxnPhysics) {
    let isDying = false;

    return obj.handles("moved", (self, ev) => {
        if (ev.hitGround && !ev.previousOnGround) {
            self.speed.at(0, 0);
            isDying = true;
        }
    })
        .coro(function* (self) {
            yield () => isDying;
            yield sleep(1500);
            self.alpha = 0.5;
            yield sleep(500);
            self.destroy();
        });
}
