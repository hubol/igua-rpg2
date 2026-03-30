import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { IguaAudio, Jukebox } from "../core/igua-audio";

export function scnIndianaHallOfDoors() {
    IguaAudio.sfxDelayFeedback = 0;
    Jukebox.play(Mzk.SodaMachine);
    Lvl.IndianaHallOfDoors();
}
