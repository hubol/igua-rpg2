import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Instances } from "../../lib/game-engine/instances";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { Jukebox } from "../core/igua-audio";
import { rewardValuables } from "../cutscene/reward-valuables";
import { ask, show } from "../cutscene/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objFxSparkleMany } from "../objects/effects/obj-fx-sparkle-many";
import { objMarker } from "../objects/utils/obj-marker";
import { RpgPlayerWallet } from "../rpg/rpg-player-wallet";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltown() {
    Jukebox.play(Mzk.HomosexualFeet);
    const lvl = Lvl.NewBalltown();
    enrichOliveFanatic(lvl);
    enrichCroupier(lvl);
    enrichSparkles();
}

function enrichSparkles() {
    objFxSparkleMany(...Instances(objMarker, obj => obj.tint === 0xffffff)).show();
}

function enrichOliveFanatic(lvl: LvlType.NewBalltown) {
    lvl.OliveFanatic.mixin(mxnCutscene, function* () {
        lvl.OliveFanatic.isDucking = false;
        yield sleep(500);
        const result = yield* ask(
            "Level with me here, how interested are you in olives?",
            "Many interested",
            "Somewhat interested",
            "Not interested",
        );

        if (result === 2) {
            yield* show(
                "That's too bad. I think they are really cool.",
                "If you change your mind, we can talk about olives sometime!",
            );
        }
        else {
            yield* show(
                "Ah, yay!",
                "Did you know that the olives that grow in New Balltown aren't brined?",
                "The salt mines directly below us give the olives a delicious flavor!",
            );
        }
        lvl.OliveFanatic.isDucking = true;
        yield sleep(500);
    });

    lvl.OliveFanatic.isDucking = true;
    lvl.OliveFanatic.ducking = 1;
    lvl.OliveFanatic.auto.duckingSpeed *= 0.5;
}

const risks = [1, 3, 5, 10, 25];

function getAvailableRisks(currentValuables: number) {
    const availableRisks = Empty<number>();
    for (const risk of risks) {
        if (currentValuables >= risk) {
            availableRisks.push(risk);
        }
    }

    return availableRisks;
}

function enrichCroupier(lvl: LvlType.NewBalltown) {
    lvl.Croupier.mixin(mxnCutscene, function* () {
        yield* show(
            "The New Balltown committee recently ruled that gambling in the town square was OK depending on the vibes.",
        );
        if (yield* ask("Want to play a dice game?")) {
            if (RpgPlayerWallet.isEmpty()) {
                yield* show("Oh... you don't have any valuables...", "Let's play when you find some!");
                return;
            }
            const guess = yield* ask("What face of the die will land face-up?", "1", "2", "3", "4", "5", "6");

            const availableRisks = getAvailableRisks(RpgProgress.character.inventory.valuables);

            const risked = yield* ask(
                `How many valuables would you like to risk? You'll win five times as many if the die lands on ${
                    guess + 1
                }.`,
                "Nevermind",
                ...availableRisks.map(risk => `${risk}V`),
            );

            if (risked === 0) {
                yield* show("Oh okay, maybe we can play later!");
                return;
            }

            const riskedValue = availableRisks[risked - 1];

            yield* show(`Okay. I'll take your ${riskedValue === 1 ? "valuable" : "valuables"} now.`);
            // TODO sfx, vfx for take money
            RpgPlayerWallet.spendValuables(riskedValue, "gambling");

            yield sleep(500);

            yield* show(`Rolling the dice... Let's see that ${guess + 1}!`);

            Sfx.Enemy.Suggestive.Flick.play();
            yield interpvr(lvl.DiceBlock).translate(0, -50).over(200);
            lvl.DiceBlock.angle = 0;
            const tuneObj = container().coro(function* () {
                while (true) {
                    Sfx.Interact.SignRead.with.gain(0.3).rate(Rng.float(1.2, 1.8)).play();
                    yield sleepf(8);
                }
            }).show();
            yield interp(lvl.DiceBlock, "angle").steps(16).to(720).over(1000);
            tuneObj.destroy();
            yield sleep(250);
            yield interpvr(lvl.DiceBlock).translate(0, 50).over(150);
            Sfx.Impact.PocketableItemBounceHard.with.rate(Rng.float(0.9, 1.1)).play();
            yield interpvr(lvl.DiceBlock).translate(0, -25).over(200);
            yield interpvr(lvl.DiceBlock).steps(5).translate(0, 25).over(200);
            Sfx.Impact.PocketableItemBounceMedium.with.rate(Rng.float(0.9, 1.1)).play();
            yield interpvr(lvl.DiceBlock).steps(4).translate(0, -10).over(200);
            yield sleep(50);
            yield interpvr(lvl.DiceBlock).steps(3).translate(0, 10).over(200);
            Sfx.Impact.PocketableItemBounceSoft.with.rate(Rng.float(0.9, 1.1)).play();

            yield sleep(250);

            const roll = Rng.int(6);
            yield* show(`It's a ${roll + 1}.`);

            if (roll === guess) {
                const prize = riskedValue * 5;
                yield* show("Nice guess!", `You win ${prize} valuables!`);
                yield* rewardValuables(prize, lvl.Croupier, "gambling");
            }
            else {
                yield* show("Sorry, you lost. You can always try again!");
            }
        }
        else {
            yield* show("I'll be here if you change your mind!");
        }
    });
}
