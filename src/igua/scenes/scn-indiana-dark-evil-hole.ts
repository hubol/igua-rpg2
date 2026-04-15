import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { DramaGifts } from "../drama/drama-gifts";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnIndianaDarkEvilHole() {
    const lvl = Lvl.IndianaDarkEvilHole();
    enrichShoeHaverNpc(lvl);
}

function enrichShoeHaverNpc(lvl: LvlType.IndianaDarkEvilHole) {
    lvl.ShoeHaverNpc
        .mixin(mxnCutscene, function* () {
            const gift = Rpg.gift("Indiana.DarkEvilHole.Illuminate");
            if (gift.isGiveable()) {
                yield* DramaGifts.give(gift);
            }
        });
}
