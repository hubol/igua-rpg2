import { DataShop } from "../data/data-shop";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgFlops } from "./rpg-flops";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPocket } from "./rpg-pocket";
import { RpgPotions } from "./rpg-potions";

export class RpgInventory {
    constructor(
        readonly equipment: RpgCharacterEquipment,
        readonly flops: RpgFlops,
        readonly keyItems: RpgKeyItems,
        readonly pocket: RpgPocket,
        readonly potions: RpgPotions,
    ) {
    }

    receive(product: DataShop.Product) {
        switch (product.kind) {
            case "equipment":
                this.equipment.receive(product.equipmentId);
                return;
            case "key_item":
                this.keyItems.receive(product.keyItemId);
                return;
            case "potion":
                // TODO
                return;
        }
    }
}
