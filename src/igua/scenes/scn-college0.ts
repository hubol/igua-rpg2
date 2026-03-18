import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { ForceTintFilter } from "../../lib/pixi/filters/force-tint-filter";
import { Jukebox } from "../core/igua-audio";
import { DramaClassroom } from "../drama/drama-classroom";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Rpg } from "../rpg/rpg";

export function scnCollege0() {
    Jukebox.play(Mzk.DespicableMessage);
    const lvl = Lvl.College0();
    lvl.Chalkboard.mixin(mxnCutscene, function* () {
        yield* DramaClassroom.teach("college0");
    });
    enrichDistantAngel(lvl);
    enrichRunningWater(lvl);
}

function enrichDistantAngel(lvl: LvlType.College0) {
    if (Rng.float() < 0.3) {
        return;
    }
    lvl.DistantAngel
        .filtered(new ForceTintFilter(0x98c8ae, 0.5))
        .mixin(mxnSinePivot)
        .coro(function* (self) {
            yield sleep(5000);
            yield interpvr(self).factor(factor.sine).to(lvl.DistantAngelTarget).over(7000);
        });
}

function enrichRunningWater(lvl: LvlType.College0) {
    lvl.SpigotRegion
        .mixin(mxnSpeaker, { name: "Mysterious Spigot", tintPrimary: 0xCBB53F, tintSecondary: 0x9793BC })
        .mixin(mxnCutscene, function* () {
            const message = Rpg.flags.indianaUniversity.isWaterRunning
                ? "You hear the sound of running water."
                : "This is a mysterious spigot.";
            yield* show(message);
            if (yield* ask(message + "\nTurn it?")) {
                Rpg.flags.indianaUniversity.isWaterRunning = !Rpg.flags.indianaUniversity.isWaterRunning;
                yield* show(
                    Rpg.flags.indianaUniversity.isWaterRunning
                        ? "You hear the sound of running water."
                        : "The sound of running water is snuffed out by your violence.",
                );
            }
            else {
                yield* show("Probably a good move. This spigot is just a little too mysterious.");
            }
        });
}
