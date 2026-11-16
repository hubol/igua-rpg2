import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { mxnFxJumpBpm } from "../mixins/effects/mxn-fx-jump-bpm";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnDetectPlayer } from "../mixins/mxn-detect-player";

export function scnJumpGoon() {
    const mzk = Mzk.ArticulateReunion;
    Jukebox.play(mzk);

    const lvl = Lvl.JumpGoon();
    lvl.GoonNpc
        .mixin(mxnDetectPlayer)
        .step(self => {
            const dx = Math.sign(self.mxnDetectPlayer.relativePosition.x);
            if (dx) {
                self.auto.facing = dx;
            }
        })
        .mixin(mxnFxJumpBpm, { mzk, bpm: 137, speed: -2.5 })
        .mixin(mxnCutscene, function* () {
            yield* show("I love jumping!!!");
            yield* dramaShop("JumpGoon", lvl.GoonNpc.speaker);
        });
}
