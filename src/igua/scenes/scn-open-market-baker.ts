import { Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { Jukebox } from "../core/igua-audio";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaMisc } from "../drama/drama-misc";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objFxFieryBurst170px } from "../objects/effects/obj-fx-fiery-burst-170px";
import { objEsotericBakerCakeChecker } from "../objects/esoteric/obj-esoteric-baker-cake-checker";
import { objEsotericMishaBirthdayCake } from "../objects/esoteric/obj-esoteric-misha-birthday-cake";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnOpenMarketBaker() {
    Jukebox.play(Mzk.PreciousInstructions);
    const lvl = Lvl.OpenMarketBaker();
    enrichBakerNpc(lvl);
}

function enrichBakerNpc(lvl: LvlType.OpenMarketBaker) {
    let everSmokedInHere = false;
    const mishaBirthdayQuest = Rpg.quest("MishaHouse.Birthday");
    const cakeItem: RpgInventory.Item.KeyItem = { kind: "key_item", id: "MishaCake" };

    lvl.BakerNpc
        .mixin(mxnCutscene, function* () {
            if (Rpg.character.buffs.cosmetic.cigaretteSmoking > 0) {
                yield* show("Please do not smoke in here.");
                everSmokedInHere = true;
                return;
            }

            yield* show(
                everSmokedInHere ? "Thank you for not smoking." : "Oh, hey!!!! Welcome to the bakery!!!!",
                "I just moved my shop to the market. So, PLEASE excuse the mess!!!",
            );

            const response = yield* ask(
                "Anything I can get for you?",
                "Cake, please!",
                mishaBirthdayQuest.flags.spokeWithBaker && !mishaBirthdayQuest.flags.learnedMishasAge
                    ? "Where is Aidar?"
                    : null,
                !mishaBirthdayQuest.flags.spokeWithBaker && mishaBirthdayQuest.flags.readCalendar
                    ? "Something for Misha's birthday"
                    : null,
                mishaBirthdayQuest.flags.learnedMishasAge ? "I know Misha's age!" : null,
                "Nothing right now!",
            );

            if (response === 4) {
                yield* show("All good!!! See you around!!!");
                return;
            }

            if (response === 3) {
                if (Rpg.inventory.count(cakeItem) >= 1) {
                    yield* show("Yes, and I gave you a cake with the exact number of candles.");
                    return;
                }

                yield* show("You do? Tell me, then!");
                const age = yield* DramaMisc.askNullableInteger(
                    "How old is Misha today?",
                    {
                        max: 100,
                        min: 1,
                        rejectMessage: "Not sure, actually...",
                        messageObj: Sprite.from(Tx.Characters.BakerPortrait).anchored(0.5, 0.825),
                    },
                );
                if (age === null) {
                    yield* show("Oh, I see.");
                    return;
                }
                else if (age < 50) {
                    yield* show("No, that can't be right.");
                    return;
                }
                yield* show("Oh, great! Let me get to work!");
                const cakeObj = objEsotericMishaBirthdayCake(age)
                    .at(lvl.MishaCakeMarker)
                    .show();

                Sfx.Esoteric.MishaCakeBuild.play();
                yield interp(cakeObj.objEsotericMishaBirthdayCake, "visibleUnit").to(1).over(2000);

                yield* show("Now, let's run the cake through the cake checker, just to be sure.");

                const checkerObj = objEsotericBakerCakeChecker()
                    .at(99, -174)
                    .show();

                Sfx.Esoteric.CakeCheckAppear.play();

                yield interpvr(checkerObj).translate(0, 174).over(4300);

                yield* show("Let's check the bake first.");

                yield* checkerObj.objEsotericBakerCakeChecker.dramaRunHead();
                yield* checkerObj.objEsotericBakerCakeChecker.dramaShowLight("ok");

                yield* show("Nice, bake is good.");

                yield* checkerObj.objEsotericBakerCakeChecker.dramaReset();

                yield* show("Next, let's check color accuracy.");

                yield* checkerObj.objEsotericBakerCakeChecker.dramaRunHead();
                yield* checkerObj.objEsotericBakerCakeChecker.dramaShowLight("ok");

                yield* show("Awesome, color checks out.");

                yield* checkerObj.objEsotericBakerCakeChecker.dramaReset();

                yield* show(`Now let's check factual correctness. Is Misha really turning ${age}?`);

                const isCorrect = age === mishaBirthdayQuest.flags.learnedMishasAge;

                yield* checkerObj.objEsotericBakerCakeChecker.dramaRunHead();
                yield* checkerObj.objEsotericBakerCakeChecker.dramaShowLight(isCorrect ? "ok" : "bad");

                yield* checkerObj.objEsotericBakerCakeChecker.dramaReset();

                if (isCorrect) {
                    yield* show("Yep, looks good to me!");
                    cakeObj.destroy();
                    yield* DramaInventory.receiveCount(cakeItem, 1);
                    yield* show("Take that to Misha right away!!!");
                }
                else {
                    yield* show(
                        "No, something is wrong.",
                        "Are you sure that is Misha's age?",
                    );

                    Sfx.Interact.BombExplode.rate(0.95, 1.05);
                    objFxFieryBurst170px().at(cakeObj.getWorldCenter()).show();
                    cakeObj.destroy();
                }

                Sfx.Esoteric.DarkEvilHoleEscape.rate(1.4).play();
                yield interpvr(checkerObj).translate(0, -174).over(1000);
                checkerObj.destroy();

                return;
            }

            if (response === 0) {
                yield* dramaShop("OpenBaker", lvl.BakerNpc.speaker);
                return;
            }

            if (response === 1) {
                yield* show(
                    "Aidar, Misha's good friend, spends a lot of time in the lumberyard.",
                    "He will probably know how old Misha is.",
                );
                return;
            }

            mishaBirthdayQuest.flags.spokeWithBaker = true;

            const shouldMakeCakeResponse = yield* ask(
                "Oh, it's Misha's birthday?! I should totally make him a cake, shouldn't I?",
            );

            if (!shouldMakeCakeResponse) {
                yield* ask(
                    "I don't know. I think everyone likes birthday cake...",
                    "Good point",
                    "That's a good point",
                    "Very good point",
                );
            }

            yield* show(
                "The only problem is... I don't know how old Misha is turning...",
                "So I don't know how many candles to put on the cake.",
            );

            yield* ask("Do you know how old Misha is turning?", "No");

            yield* show(
                "Hmmmm...",
                "There's a guy named Aidar who is good friends with Misha.",
            );

            {
                const response = yield* ask(
                    "Maybe he will know how old Misha is!",
                    "OK, great",
                    "Where can I find Aidar?",
                );

                if (response === 1) {
                    yield* show(
                        "Aidar spends a lot of time in the lumberyard.",
                        "He makes crazy sculptures!",
                        "If you take him some lumber he will probably turn it into something cool!",
                        "Anyway...",
                    );
                }
            }

            yield* show("Good luck figuring out how old Misha is!");
        });
}
