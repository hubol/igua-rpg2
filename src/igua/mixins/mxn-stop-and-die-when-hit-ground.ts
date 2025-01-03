import { interp } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
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
            yield sleep(1000);
            yield interp(self, "alpha").steps(4).to(0.5).over(500);
            yield sleep(500);
            for (let i = 0; i < 16; i++) {
                self.visible = !self.visible;
                yield sleepf(2);
            }
            self.destroy();
        });
}
