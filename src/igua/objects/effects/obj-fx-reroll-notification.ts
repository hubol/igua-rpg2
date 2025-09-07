import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";

export function objFxRerollNotification() {
    return Sprite.from(Tx.Effects.RerolledLoot)
        .anchored(0.5, 0.5)
        .mixin(mxnBoilPivot)
        .merge({ controls: { die: false } })
        .step(self => self.y -= 1)
        .scaled(0.5, 0.5)
        .coro(function* (self) {
            yield sleepf(10);
            self.scaled(1, 1);
            yield () => self.controls.die;
            self.alpha = 0.5;
            yield sleepf(10);
            self.destroy();
        });
}

export type ObjFxRerollNotification = ReturnType<typeof objFxRerollNotification>;
