import { sleep } from "../../lib/game-engine/routines/sleep";
import { RpgLoot } from "../rpg/rpg-loot";
import { objPocketableItem } from "./obj-pocketable-item";
import { objValuableTrove } from "./obj-valuable-trove";

export function objLootDrop(drop: RpgLoot.Drop) {
    return objValuableTrove(drop.valuables)
        .coro(function* (self) {
            for (const pocketItem of drop.pocketItems) {
                // TODO probably can't just have them landing on each other
                objPocketableItem.parachuting(pocketItem).at(self).show(self.parent);
                yield sleep(250);
            }
        });
}
