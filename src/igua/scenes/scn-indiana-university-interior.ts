import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";

export function scnIndianaUniversityInterior() {
    Jukebox.play(Mzk.DespicableMessage);
    Lvl.IndianaUniversityInterior();
}
