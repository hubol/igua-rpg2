import { Rng } from "../../lib/math/rng";
import { DataItem } from "../data/data-item";
import { RpgInventory } from "../rpg/rpg-inventory";

export function objDroppedItem(item: RpgInventory.Item) {
    const api = {
        item,
    };

    return DataItem
        .getFigureObj(item)
        .pivotedUnit(0.5, 0.5)
        .merge({ objDroppedItem: api })
        .step(self => {
            if (Rng.bool()) {
                self.y++;
            }
        })
        .track(objDroppedItem);
}
