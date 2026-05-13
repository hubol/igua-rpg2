import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { objEsotericEmptyHall } from "../objects/esoteric/obj-esoteric-empty-hall";
import { Rpg } from "../rpg/rpg";

export function scnIndianaHallEmpty() {
    Jukebox.play(Mzk.SodaMachine);
    Lvl.IndianaHallEmpty();

    objEsotericEmptyHall(Rpg.microcosms["Indiana.HallOfDoors"]).show();
}
