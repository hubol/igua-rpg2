import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { IguaAudio, Jukebox } from "../core/igua-audio";
import { mxnDoorHallEmpty } from "../mixins/mxn-door-hall-empty";
import { Rpg } from "../rpg/rpg";

export function scnIndianaHallOfDoors() {
    IguaAudio.sfxDelayFeedback = 0;
    Jukebox.play(Mzk.SodaMachine);
    const lvl = Lvl.IndianaHallOfDoors();
    const cosmHallOfDoors = Rpg.microcosms["Indiana.HallOfDoors"];
    lvl.MagicDoor0.mixin(mxnDoorHallEmpty, cosmHallOfDoors, 0);
}
