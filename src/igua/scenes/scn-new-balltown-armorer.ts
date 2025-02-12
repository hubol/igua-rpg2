import { BLEND_MODES } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
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
import { Cutscene } from "../globals";
import { objFish } from "../objects/obj-fish";
import { ZIndex } from "../core/scene/z-index";
import { objFxBurst32 } from "../objects/effects/obj-fx-burst-32";

export function scnNewBalltownArmorer() {
    Jukebox.play(Mzk.GolfResort);
    const lvl = Lvl.NewBalltownArmorer();
    enrichArmorer(lvl);
    enrichAquarium(lvl);
    enrichFishmonger(lvl);
}

function enrichFishmonger(lvl: LvlType.NewBalltownArmorer) {
    const { deliveries } = RpgProgress.flags.newBalltown.fishmonger;

    const fishObj = objFish.forArmorer().at(lvl.FishMarker).zIndexed(ZIndex.Entities);
    fishObj.isMoving = false;

    if (deliveries.armorer === "delivered") {
        fishObj.show();
        lvl.IguanaNpc.at(lvl.Fishmonger);
    }

    if (deliveries.armorer !== "arrived") {
        lvl.Fishmonger.destroy();
        return;
    }

    lvl.IguanaNpc.x -= 32;
    lvl.IguanaNpc.setFacingOverrideAuto(1);

    Cutscene.play(function* () {
        lvl.IguanaNpc.speed.y = -2;
        yield () => lvl.IguanaNpc.speed.y === 0;
        yield sleep(250);
        lvl.IguanaNpc.auto.facing = -1;
        yield sleep(250);
        yield* show(
            "Oh how delightful! What a surprise!",
            "I would have never guessed in a million years that I would have my very own fishy!",
        );
        // TODO should be more idiomatic way to set this!
        Cutscene.current!.attributes.speaker = lvl.Fishmonger;
        lvl.Fishmonger.isDucking = true;
        yield sleep(500);
        yield* show("Okay... I'm going to begin the installation");
        lvl.IguanaNpc.auto.facing = 1;

        yield sleep(500);

        fishObj.add(0, -64).show();
        objFxBurst32().at(fishObj).show();

        yield sleep(500);

        yield interpvr(fishObj).factor(factor.sine).to(lvl.FishMarker).over(4000);

        yield sleep(1000);

        lvl.Fishmonger.isDucking = false;

        yield sleep(1000);

        Cutscene.current!.attributes.speaker = lvl.IguanaNpc;
        yield* show("Well...? How'd it go?");

        yield* lvl.Fishmonger.walkTo(lvl.Door.x);

        Cutscene.current!.attributes.speaker = lvl.Fishmonger;
        yield* show("Without a hitch!", "Congratulations on your new fishy!");

        Sfx.Interact.DoorOpen0.play();

        lvl.Fishmonger.destroy();

        lvl.IguanaNpc.speed.y = -6;
        yield* lvl.IguanaNpc.walkTo(lvl.FishMarker.x + 30);

        lvl.IguanaNpc.auto.facing = -1;

        Cutscene.current!.attributes.speaker = lvl.IguanaNpc;
        yield* show("Happy...! Happy...! Happy...!", "Thank you so much for arranging the delivery of the fish.");
        yield* rewardValuables(160, lvl.IguanaNpc);
        yield* show("You are cool.");

        deliveries.armorer = "delivered";
    }, { speaker: lvl.IguanaNpc });
}

function enrichArmorer(lvl: LvlType.NewBalltownArmorer) {
    lvl.IguanaNpc.mixin(mxnCutscene, function* () {
        const delivered = RpgProgress.flags.newBalltown.fishmonger.deliveries.armorer === "delivered";

        if (delivered) {
            yield* show("Fishy, fishy...");
        }

        const result = yield* ask("What's going on?", "About zinc", delivered ? null : "About fishtank", "Muddy house");
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
