import { Integer } from "../../lib/math/number-alias-types";
import { DataEquipment } from "../data/data-equipment";
import { DataKeyItem } from "../data/data-key-item";
import { DataPocketItem } from "../data/data-pocket-item";
import { DataPotion } from "../data/data-potion";
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
            case "pocket_item":
                return this.pocket.count(item.id);
        }
    }

    receive(item: RpgInventory.Item) {
        switch (item.kind) {
            case "equipment":
                this.equipment.receive(item.id, item.level);
                return;
            case "key_item":
                this.keyItems.receive(item.id);
                return;
            case "potion":
                this.potions.receive(item.id);
                return;
            case "pocket_item":
                this.pocket.receive(item.id);
                return;
        }
    }

    remove(item: RpgInventory.RemovableItem, count: Integer) {
        switch (item.kind) {
            case "key_item":
                this.keyItems.remove(item.id, count);
                return;
            case "potion":
                this.potions.remove(item.id, count);
                return;
            case "pocket_item":
                this.pocket.remove(item.id, count);
                return;
        }
    }
}

export namespace RpgInventory {
    export type Item = Item.Equipment | Item.KeyItem | Item.PocketItem | Item.Potion;

    // TODO probably need to model them all
    export namespace Item {
        export interface Equipment {
            kind: "equipment";
            id: DataEquipment.Id;
            level: Integer;
        }

        export interface KeyItem {
            kind: "key_item";
            id: DataKeyItem.Id;
        }

        export interface Potion {
            kind: "potion";
            id: DataPotion.Id;
        }

        export interface PocketItem {
            kind: "pocket_item";
            id: DataPocketItem.Id;
        }
    }

    export type RemovableItem = Item.KeyItem | Item.PocketItem | Item.Potion;
}
