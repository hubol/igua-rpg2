import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Instances } from "../../lib/game-engine/instances";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Empty } from "../../lib/types/empty";
import { Jukebox } from "../core/igua-audio";
import { rewardValuables } from "../cutscene/reward-valuables";
import { ask, show } from "../cutscene/show";
import { NpcPersonas } from "../data/data-npc-personas";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFxSparkleMany } from "../objects/effects/obj-fx-sparkle-many";
import { objMarker } from "../objects/utils/obj-marker";
import { RpgPlayerWallet } from "../rpg/rpg-player-wallet";
import { RpgProgress } from "../rpg/rpg-progress";
import { Tx } from "../../assets/textures";
import { objIndexedSprite } from "../objects/utils/obj-indexed-sprite";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
import { ZIndex } from "../core/scene/z-index";

export function scnNewBalltown() {
    Jukebox.play(Mzk.HomosexualFeet);
    const lvl = Lvl.NewBalltown();
    enrichOliveFanatic(lvl);
    enrichCroupier(lvl);
    enrichSparkles();
    enrichMiner(lvl);
    enrichMechanicalIdol(lvl);
    enrichFishmongerDeliveryToArmorer(lvl);
}

function enrichSparkles() {
    objFxSparkleMany(...Instances(objMarker, obj => obj.tint === 0xffffff)).show();
}

function enrichMiner(lvl: LvlType.NewBalltown) {
    lvl.Miner.mixin(mxnCutscene, function* () {
        const result = yield* ask(
            `Name's ${lvl.Miner.speaker.name}. I used to mine in these famous mines. Now I don't. How can I help?`,
            "Why is it famous",
            "Why don't you",
            "The flowers",
            RpgProgress.flags.outskirts.miner.toldPlayerAboutDepletedPickaxeHealth ? "Your brother's axe" : null,
            "You can't",
        );

        if (result === 0) {
            yield* show(
                "These mines are very famous due to being very awesome.",
                "A lot of people come to see them every year, during the Generator festival.",
                "The Generator festival is a time when things are also awesome.",
                "It's hard to explain to out-of-towners.",
            );
        }
        else if (result === 1) {
            yield* show(
                "I mined in these very famous mines for many years, but gave it up when my brother got really good at it.",
                "To be honest, he found a much better mine to the east.",
                "His mine has valuables that the casino does not have jurisdiction over.",
            );
        }
        else if (result === 2) {
            yield* show("The flowers were a retirement gift!");
        }
        else if (result === 3) {
            yield* show(
                "Oh, so his picaxe finally broke?",
                "...He says there is a shop in town that could sell a replacement?",
                "My brother and I don't communicate very well... So I think he is mistaken.",
                "The shop he is probably referring to went out of business a long time ago.",
                "It was located where the mysterious machine is now.",
            );
        }
        else if (result === 4) {
            yield* show("Take it easy dude.");
        }
    });
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

function enrichMechanicalIdol(lvl: LvlType.NewBalltown) {
    const options = ["Ball", "Star", "P", "3", "F"] as const;
    const optionToCharacters: Record<typeof options[number], string> = {
        "3": "3",
        Ball: "O",
        F: "F",
        P: "P",
        Star: "*",
    };

    lvl.MechanicalIdol
        .mixin(mxnSpeaker, { name: "Mechanical Idol", colorPrimary: 0xDCC132, colorSecondary: 0xB52417 })
        .mixin(mxnCutscene, function* () {
            if (!(yield* ask("Please input 5-symbol password"))) {
                return;
            }

            const characters = range(5).map(() => "_");

            function getCurrentPasswordMessage() {
                return `                             ${characters.join(" ")}`;
            }

            for (let i = 0; i < characters.length; i++) {
                const shuffledOptions = Rng.shuffle([...options]);
                const index = yield* ask("\n" + getCurrentPasswordMessage(), ...shuffledOptions);
                const option = shuffledOptions[index];
                const character = optionToCharacters[option];
                characters[i] = character;
            }

            yield* show("Checking...\n" + getCurrentPasswordMessage());

            const password = characters.join("");
            if (password === "POOP*") {
                yield* show("Access granted.");
                // TODO a prize!
            }
            else {
                yield* show("Access denied.");
                return;
            }
        });
}

function enrichFishmongerDeliveryToArmorer(lvl: LvlType.NewBalltown) {
    const expectedCheckpointName: keyof LvlType.NewBalltown = "fromFishmonger";

    if (
        !RpgProgress.flags.newBalltown.fishmonger.isReadyToDeliverToArmorer
        || RpgProgress.character.position.checkpointName !== expectedCheckpointName
    ) {
        RpgProgress.flags.newBalltown.fishmonger.isReadyToDeliverToArmorer = false;
        lvl.Fishmonger.destroy();
        return;
    }

    Cutscene.play(function* () {
        yield* show(
            `To make the delivery more challenging, I am placing bombs along the route to ${NpcPersonas.NewBalltownArmorer.name}'s place.`,
        );

        yield sleep(500);

        for (const markerObj of Instances(objMarker, obj => obj.tint === 0xff0000)) {
            objFishmongerBomb().at(markerObj).show();
        }

        yield sleep(500);

        yield* show("Please defuse the bombs before I reach them, so that I can successfully deliver the fish.");

        lvl.Fishmonger.coro(function* (self) {
            self.walkingTopSpeed = 0.3;
            yield* self.walkTo(lvl.FishmongerStopAndJump.x);
            yield sleep(500);
            self.walkingTopSpeed = 0.7;
            self.speed.y = -6;
            yield* self.walkTo(lvl.ArmorerDoor.x);
        });
    }, { speaker: lvl.Fishmonger });
}

const txsFishmongerBomb = Tx.Town.Ball.FishmongerBomb.split({ count: 2 });

function objFishmongerBomb() {
    return objIndexedSprite(txsFishmongerBomb).anchored(0.5, 0.9).step(self =>
        self.textureIndex = (self.textureIndex + 0.1) % 2
    ).mixin(
        mxnNudgeAppear,
    )
        .zIndexed(ZIndex.Entities);
}
