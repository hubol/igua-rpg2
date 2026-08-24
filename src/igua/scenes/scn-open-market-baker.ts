import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnOpenMarketBaker() {
    Jukebox.play(Mzk.PreciousInstructions);
    const lvl = Lvl.OpenMarketBaker();
    enrichBakerNpc(lvl);
}

function enrichBakerNpc(lvl: LvlType.OpenMarketBaker) {
    const mishaBirthdayQuest = Rpg.quest("MishaHouse.Birthday");

    lvl.BakerNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "Oh, hey!!!! Welcome to the bakery!!!!",
                "I just moved my shop to the market. So, PLEASE excuse the mess!!!",
            );

            const response = yield* ask(
                "Anything I can get for you?",
                "Cake, please!",
                mishaBirthdayQuest.flags.spokeWithBaker ? "Where is Aidar?" : null,
                !mishaBirthdayQuest.flags.spokeWithBaker && mishaBirthdayQuest.flags.readCalendar
                    ? "Something for Misha's birthday"
                    : null,
                "Nothing right now!",
            );

            if (response === 3) {
                yield* show("All good!!! See you around!!!");
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
