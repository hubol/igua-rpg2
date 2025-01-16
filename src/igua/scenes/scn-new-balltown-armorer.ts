import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { factor, interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../cutscene/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownArmorer() {
    Jukebox.play(Mzk.GolfResort);
    const lvl = Lvl.NewBalltownArmorer();
    enrichArmorer(lvl);
    enrichAquarium(lvl);
}

function enrichArmorer(lvl: ReturnType<typeof Lvl["NewBalltownArmorer"]>) {
    lvl.IguanaNpc.mixin(mxnCutscene, function* () {
        const result = yield* ask("What's going on?", "About zinc", "About fishtank", "Muddy house");
        if (result === 0) {
            yield* show("Zinc is an element that makes your loads bigger.");
        }
        else if (result === 1) {
            yield* show("Ah, my fishtank.", "I need water for it.");
        }
        else if (result === 2) {
            yield* show("You are judgmental, and in many ways a bitch.");
        }
    });
}

function enrichAquarium(lvl: ReturnType<typeof Lvl["NewBalltownArmorer"]>) {
    const maximumMoistureUnits = 300;

    lvl.AquariumWaterLine.merge({ observedMoistureUnits: RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits })
        .step(self => {
            self.scale.y = Math.min(1, self.observedMoistureUnits / maximumMoistureUnits);
        })
        .coro(function* (self) {
            while (true) {
                yield () => RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits !== self.observedMoistureUnits;
                yield interp(self, "observedMoistureUnits").factor(factor.sine).to(
                    RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits,
                ).over(1000);
            }
        });

    lvl.AquariumWaterIntake.mixin(mxnSpeaker, {
        colorPrimary: 0x0B4FA8,
        colorSecondary: 0x0BC6A8,
        name: "Automated Water Intake",
    }).mixin(mxnCutscene, function* () {
        if (RpgProgress.character.status.wetness.value === 0) {
            yield* show(`--Water analysis
No moisture detected.`);
            return;
        }
        yield* show(`--Water analysis
${RpgProgress.character.status.wetness.value} moisture units detected.`);

        const purity = Math.round(AdjustColor.pixi(RpgProgress.character.status.wetness.tint).toRgb().b);

        yield* show(`--Purity analysis
Got ${purity}
Need at least 150`);

        if (purity < 150) {
            return;
        }

        if (
            (yield* ask(
                `Sure you want to deposit ${RpgProgress.character.status.wetness.value} moisture unit(s) with purity ${purity}?`,
                "y",
                "n",
            )) === 0
        ) {
            RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits = Math.min(
                RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits
                    + RpgProgress.character.status.wetness.value,
                maximumMoistureUnits,
            );
            RpgProgress.character.status.wetness.value = 0;
            Sfx.Fluid.Slurp.play();
            yield sleep(1000);
        }
    });
}
