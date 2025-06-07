import { BLEND_MODES } from "pixi.js";
import { LvlNewBalltownArmorer, lvlNewBalltownArmorer } from "../../assets/generated/levels/lvl-new-balltown-armorer";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { StringFromNumber } from "../../lib/string/string-from-number";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaMisc } from "../drama/drama-misc";
import { DramaQuests } from "../drama/drama-quests";
import { DramaWallet } from "../drama/drama-wallet";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnComputer } from "../mixins/mxn-computer";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFxBurst32 } from "../objects/effects/obj-fx-burst-32";
import { objFish } from "../objects/obj-fish";
import { RpgExperienceRewarder } from "../rpg/rpg-experience-rewarder";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownArmorer() {
    Jukebox.play(Mzk.GolfResort);
    const lvl = lvlNewBalltownArmorer();
    enrichArmorer(lvl);
    enrichAquarium(lvl);
    enrichFishmonger(lvl);
}

function enrichFishmonger(lvl: LvlNewBalltownArmorer) {
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

        Cutscene.setCurrentSpeaker(lvl.IguanaNpc);
        yield* show(
            "Oh how delightful! What a surprise!",
            "I would have never guessed in a million years that I would have my very own fishy!",
        );

        Cutscene.setCurrentSpeaker(lvl.Fishmonger);
        lvl.Fishmonger.isDucking = true;
        yield sleep(500);
        yield* show("Okay... I'm going to begin the installation");
        lvl.IguanaNpc.auto.facing = 1;

        yield sleep(500);

        Sfx.Cutscene.FishTake.play();
        fishObj.add(0, -64).show();
        objFxBurst32().at(fishObj).show();

        yield sleep(500);

        yield interpvr(fishObj).factor(factor.sine).to(lvl.FishMarker).over(4000);

        yield sleep(1000);

        lvl.Fishmonger.isDucking = false;

        yield sleep(1000);

        Cutscene.setCurrentSpeaker(lvl.IguanaNpc);
        yield* show("Well...? How'd it go?");

        yield* DramaMisc.walkToDoor(lvl.Fishmonger, lvl.Door);

        Cutscene.setCurrentSpeaker(lvl.Fishmonger);
        yield* show("Without a hitch!", "Congratulations on your new fishy!");

        DramaMisc.departRoomViaDoor(lvl.Fishmonger);

        lvl.IguanaNpc.speed.y = -6;
        yield* lvl.IguanaNpc.walkTo(lvl.FishMarker.x + 30);

        lvl.IguanaNpc.auto.facing = -1;

        Cutscene.setCurrentSpeaker(lvl.IguanaNpc);
        yield* show("Happy...! Happy...! Happy...!", "Thank you so much for arranging the delivery of the fish.");
        yield* DramaQuests.completeQuest("NewBalltownArmorerReceivesFish", lvl.IguanaNpc);
        yield* show("You are cool.");

        deliveries.armorer = "delivered";
    });
}

function enrichArmorer(lvl: LvlNewBalltownArmorer) {
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
                yield* DramaWallet.rewardValuables(15, lvl.IguanaNpc);
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

function enrichAquarium(lvl: LvlNewBalltownArmorer) {
    const { wetness } = RpgProgress.character.status.conditions;

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
    }).mixin(mxnComputer).mixin(mxnCutscene, function* () {
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
                RpgExperienceRewarder.computer.onInteract("small_task");
            }
        }

        yield* show(`--Fill analysis
at ${
            StringFromNumber.getPercentageNoDecimal(
                aquariumService.moistureUnits,
                aquariumService.maximumMoistureUnits,
            )
        } capacity`);
    });
}
