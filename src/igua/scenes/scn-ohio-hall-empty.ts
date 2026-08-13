import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { objEsotericEmptyHall } from "../objects/esoteric/obj-esoteric-empty-hall";
import { Rpg } from "../rpg/rpg";

export function scnOhioHallEmpty() {
    Lvl.OhioHallEmpty();
    objEsotericEmptyHall(Rpg.microcosms["Ohio.HallOfDoors"]).show();
}
