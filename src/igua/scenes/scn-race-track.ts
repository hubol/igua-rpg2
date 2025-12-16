import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Rpg } from "../rpg/rpg";

export function scnRaceTrack() {
    Rpg.character.status.conditions.poison.level = 10;
    Lvl.RaceTrack();
}
