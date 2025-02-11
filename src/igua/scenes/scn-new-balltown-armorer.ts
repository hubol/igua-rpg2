import { BLEND_MODES } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { factor, interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { StringFromNumber } from "../../lib/string/string-from-number";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../cutscene/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { RpgProgress } from "../rpg/rpg-progress";
import { Integer } from "../../lib/math/number-alias-types";
import { rewardValuables } from "../cutscene/reward-valuables";

export function scnNewBalltownArmorer() {
    Jukebox.play(Mzk.GolfResort);
    const lvl = Lvl.NewBalltownArmorer();
    enrichArmorer(lvl);
    enrichAquarium(lvl);
    enrichFishmonger(lvl);
}

function enrichFishmonger(lvl: LvlType.NewBalltownArmorer) {
    const { deliveries } = RpgProgress.flags.newBalltown.fishmonger;
    if (deliveries.armorer !== "arrived") {
        lvl.Fishmonger.destroy();
    }
}

function enrichArmorer(lvl: LvlType.NewBalltownArmorer) {
    lvl.IguanaNpc.mixin(mxnCutscene, function* () {
        const result = yield* ask("What's going on?", "About zinc", "About fishtank", "Muddy house");
        if (result === 0) {
            yield* show("Zinc is an element that makes your loads bigger.");
        }
        else if (result === 1) {
            if (!aquariumService.isFilled) {
                yield* show("Ah, my fishtank.", "I need water for it.");
                return;
            }

            if (RpgProgress.flags.newBalltown.armorer.toldPlayerAboutDesireForFish) {
                yield* show("It looks nice with the water in it.", "But it would look spectacular with a fish.");
            }
            else {
                yield* show("Oh, my fishtank!", "You put water in it. Thanks.");
                yield* rewardValuables(15, lvl.IguanaNpc);
                yield* show(
                    "Believe me, there's a whole lot more where that came from if you can get me a fish to live in the aquarium!",
                );
                RpgProgress.flags.newBalltown.armorer.toldPlayerAboutDesireForFish = true;
            }
        }
        else if (result === 2) {
            yield* show("You are judgmental, and in many ways a bitch.");
        }
    });
}

const aquariumService = {
    maximumMoistureUnits: 300,
    get moistureUnits() {
        return RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits;
    },
    incrementMoistureUnits(units: Integer) {
        RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits = Math.min(
            RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits + units,
            this.maximumMoistureUnits,
        );
    },
    get isFilled() {
        return RpgProgress.flags.newBalltown.armorer.aquarium.moistureUnits >= this.maximumMoistureUnits;
    },
} as const;

function enrichAquarium(lvl: LvlType.NewBalltownArmorer) {
    const { wetness } = RpgProgress.character.status;

    lvl.AquariumWaterLine.merge({ observedMoistureUnits: aquariumService.moistureUnits })
        .step(self => {
            self.scale.y = Math.min(1, self.observedMoistureUnits / aquariumService.maximumMoistureUnits);
        })
        .coro(function* (self) {
            while (true) {
                yield () => aquariumService.moistureUnits !== self.observedMoistureUnits;
                yield interp(self, "observedMoistureUnits").factor(factor.sine).to(aquariumService.moistureUnits).over(
                    1000,
                );
            }
        });

    lvl.AquariumWaterLineFront.step(self => self.scale.y = lvl.AquariumWaterLine.scale.y).blendMode =
        BLEND_MODES.MULTIPLY;

    lvl.AquariumWaterIntake.mixin(mxnSpeaker, {
        colorPrimary: 0x0B4FA8,
        colorSecondary: 0x0BC6A8,
        name: "Automated Water Intake",
    }).mixin(mxnCutscene, function* () {
        if (!aquariumService.isFilled) {
            if (wetness.value === 0) {
                yield* show(`--Water analysis
No moisture detected.`);
                return;
            }
            yield* show(`--Water analysis
${wetness.value} moisture unit(s) detected.`);

            const purity = Math.round(AdjustColor.pixi(wetness.tint).toRgb().b);

            yield* show(`--Purity analysis
Got ${purity}
Need at least 150`);

            if (purity < 150) {
                return;
            }

            if (
                (yield* ask(
                    `Sure you want to deposit ${wetness.value} moisture unit(s) with purity ${purity}?`,
                    "y",
                    "n",
                )) === 0
            ) {
                aquariumService.incrementMoistureUnits(wetness.value);
                wetness.value = 0;
                Sfx.Fluid.Slurp.play();
                yield sleep(1000);
            }
        }

        yield* show(`--Fill analysis
at ${
            StringFromNumber.getPercentageNoDecimal(aquariumService.moistureUnits, aquariumService.maximumMoistureUnits)
        } capacity`);
    });
}
