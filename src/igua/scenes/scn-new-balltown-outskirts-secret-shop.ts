import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnNewBalltownOutskirtsSecretShop() {
    Jukebox.play(Mzk.OpenWound);
    const lvl = Lvl.NewBalltownOutskirtsSecretShop();

    lvl.Shopkeeper.mixin(mxnCutscene, function* () {
        yield* dramaShop("BalltownOutskirtsSecret", { primaryTint: 0x152F12, secondaryTint: 0xE6E8CC });
    });
}
