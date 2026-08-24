import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnDetectPlayer } from "../mixins/mxn-detect-player";

export function scnJumpGoon() {
    const lvl = Lvl.JumpGoon();
    lvl.GoonNpc
        .mixin(mxnDetectPlayer)
        .step(self => {
            const dx = Math.sign(self.mxnDetectPlayer.relativePosition.x);
            if (dx) {
                self.auto.facing = dx;
            }
        })
        .coro(function* (self) {
            while (true) {
                yield () => self.isOnGround && self.speed.y >= 0;
                self.speed.y = -2.5;
            }
        })
        .mixin(mxnCutscene, function* () {
            yield* show("I love jumping!!!");
            yield* dramaShop("JumpGoon", lvl.GoonNpc.speaker);
        });
}
