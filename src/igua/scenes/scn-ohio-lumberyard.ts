import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { DramaGifts } from "../drama/drama-gifts";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnOhioLumberyard() {
    const lvl = Lvl.OhioLumberyard();
    enrichAidar(lvl);
}

function enrichAidar(lvl: LvlType.OhioLumberyard) {
    const introducedGift = Rpg.gift("Ohio.Lumberyard.Aidar.Introduced");

    lvl.AidarNpc
        .mixin(mxnCutscene, function* () {
            // TODO do you know mishas birthday
            const result = yield* ask("Hello", introducedGift.isGiveable() ? "What's going on?" : null, "Bye");
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
                    "Bring it to me and I can make my sculpture.",
                    "Maybe it will make you happy too.",
                );
            }
        });
}
