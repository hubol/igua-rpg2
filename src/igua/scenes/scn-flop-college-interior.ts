import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaClassroom } from "../drama/drama-classroom";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { playerObj } from "../objects/obj-player";

export function scnFlopCollegeInterior() {
    Jukebox.play(Mzk.DespicableMessage);
    const lvl = Lvl.FlopCollegeInterior();
    lvl.Chalkboard.mixin(mxnCutscene, function* () {
        yield () => playerObj.speed.x === 0;
        playerObj.auto.facing = -1;
        yield* DramaClassroom.teach("college_flop");
    });
}
