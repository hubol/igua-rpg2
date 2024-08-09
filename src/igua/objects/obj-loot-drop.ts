import { RpgLoot } from "../rpg/rpg-loot";
import { objValuableTrove } from "./obj-valuable-trove";

export function objLootDrop(drop: RpgLoot.Drop) {
    return objValuableTrove(drop.valuables);
}