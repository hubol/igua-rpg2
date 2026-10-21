import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { objEsotericHallEmpty } from "../objects/esoteric/obj-esoteric-hall-empty";
import { Rpg } from "../rpg/rpg";

export function scnIndianaHallEmpty() {
    Jukebox.play(Mzk.SodaMachine);
    Lvl.IndianaHallEmpty();

    objEsotericHallEmpty(Rpg.microcosms["Indiana.HallOfDoors"]).show();
}
