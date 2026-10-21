import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { objEsotericHallEmpty } from "../objects/esoteric/obj-esoteric-hall-empty";
import { Rpg } from "../rpg/rpg";

export function scnOhioHallEmpty() {
    Lvl.OhioHallEmpty();
    objEsotericHallEmpty(Rpg.microcosms["Ohio.HallOfDoors"]).show();
}
