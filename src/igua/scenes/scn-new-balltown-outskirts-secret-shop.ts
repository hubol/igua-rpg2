import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";

export function scnNewBalltownOutskirtsSecretShop() {
    Jukebox.play(Mzk.OpenWound);
    const lvl = Lvl.NewBalltownOutskirtsSecretShop();
}
