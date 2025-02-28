import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";

export function scnNewBalltownUnderneathHomeowner() {
    Jukebox.play(Mzk.PleasureMafia);
    const lvl = Lvl.NewBalltownUnderneathHomeowner();
}
