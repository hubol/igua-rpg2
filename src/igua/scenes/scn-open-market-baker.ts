import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { DramaFacts } from "../drama/drama-facts";
import { DramaMisc } from "../drama/drama-misc";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnOpenMarketBaker() {
    const lvl = Lvl.OpenMarketBaker();
    enrichBakerNpc(lvl);
}

function enrichBakerNpc(lvl: LvlType.OpenMarketBaker) {
    lvl.BakerNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "Oh, hey!!!! Welcome to the bakery!!!!",
                "I just moved my shop to the market. So, PLEASE excuse the mess!!!",
            );

            const response = yield* ask(
                "Anything I can get for you?",
                "Cake, please!",
                "Something for Misha's birthday", // TODO need to read calendar first
                "Nothing right now!",
            );

            if (response === 2) {
                yield* show("All good!!! See you around!!!");
                return;
            }

            if (response === 0) {
                // TODO
                return;
            }

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
            if (yield* ask("Do you know how old Misha is turning?")) {
                const predictedAge = yield* DramaMisc.askInteger("So, how old is Misha turning?", {
                    min: 55,
                    max: 100,
                });

                // TODO
            }
            else {
                yield* show(
                    "Hmmmm...",
                    "There's a guy named Aidar who is good friends with Misha.",
                );

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

                yield* show("Good luck figuring out how old Misha is!");
            }
        });
}
