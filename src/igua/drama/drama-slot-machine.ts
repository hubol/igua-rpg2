import { range } from "../../lib/range";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";
import { DramaInventory } from "./drama-inventory";
import { DramaPotions } from "./drama-potions";

function* winMaterial(material: RpgSlotMachine.Material) {
    if (material.kind === "consume_potion") {
        yield* DramaPotions.useOnPlayer(material.id);
        return;
    }
    yield* DramaInventory.receiveItems(range(material.count).map(() => material.item));
}

export const DramaSlotMachine = {
    winMaterial,
};
