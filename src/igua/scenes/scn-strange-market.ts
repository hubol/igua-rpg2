import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";

export function scnStrangeMarket() {
    Jukebox.play(Mzk.BigLove);
    Lvl.StrangeMarket();
}
