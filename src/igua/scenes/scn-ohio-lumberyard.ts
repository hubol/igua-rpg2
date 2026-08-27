import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaGifts } from "../drama/drama-gifts";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnOhioLumberyard() {
    Jukebox.play(Mzk.SomberToothpick);
    const lvl = Lvl.OhioLumberyard();
    enrichAidar(lvl);
}

function enrichAidar(lvl: LvlType.OhioLumberyard) {
    const introducedGift = Rpg.gift("Ohio.Lumberyard.Aidar.Introduced");
    const mishaBirthdayQuest = Rpg.quest("MishaHouse.Birthday");

    lvl.AidarNpc
        .mixin(mxnCutscene, function* () {
            const result = yield* ask(
                "Hello",
                introducedGift.isGiveable() ? "What's going on?" : null,
                mishaBirthdayQuest.flags.spokeWithBaker ? "About Misha's age" : null,
                "Bye",
            );
            if (result === 0) {
                yield* show(
                    "I just want to work on my sculpture.",
                    "But I've run out of essence.",
                    "Please, help me, wear this shoe.",
                );

                if (introducedGift.isGiveable()) {
                    yield* DramaGifts.give(introducedGift);
                }

                yield* show(
                    "The fairies will give you essence.",
                    "Bring it and I can make my sculpture.",
                    "Maybe it will make you happy too.",
                );
            }
            else if (result === 1) {
                yield* show(
                    "Misha's age? No, I don't know it.",
                    "His wife, Olga, will know.",
                    "She works at the second floor college.",
                );
                mishaBirthdayQuest.flags.spokeWithAidar = true;
            }
        });
}
