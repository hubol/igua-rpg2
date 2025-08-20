import { DataEquipment } from "../data/data-equipment";
import { DataKeyItem } from "../data/data-key-item";
import { DataPotion } from "../data/data-potion";
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

    count(item: RpgInventory.Item) {
        switch (item.kind) {
            case "equipment":
                return this.equipment.count(item.id);
            case "key_item":
                return this.keyItems.count(item.id);
            case "potion":
                return this.potions.count(item.id);
        }
    }

    receive(item: RpgInventory.Item) {
        switch (item.kind) {
            case "equipment":
                this.equipment.receive(item.id);
                return;
            case "key_item":
                this.keyItems.receive(item.id);
                return;
            case "potion":
                this.potions.receive(item.id);
                return;
        }
    }
}

export module RpgInventory {
    // TODO probably need to model them all

    interface Item_Equipment {
        kind: "equipment";
        id: DataEquipment.Id;
    }

    interface Item_KeyItem {
        kind: "key_item";
        id: DataKeyItem.Id;
    }

    interface Item_Potion {
        kind: "potion";
        id: DataPotion.Id;
    }

    export type Item = Item_Equipment | Item_KeyItem | Item_Potion;
}
