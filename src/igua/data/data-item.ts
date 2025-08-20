import { objFigureEquipment } from "../objects/figures/obj-figure-equipment";
import { objFigureKeyItem } from "../objects/figures/obj-figure-key-item";
import { objFigurePotion } from "../objects/figures/obj-figure-potion";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DataEquipment } from "./data-equipment";
import { DataKeyItem } from "./data-key-item";
import { DataPotion } from "./data-potion";

export namespace DataItem {
    export function getName(item: RpgInventory.Item) {
        switch (item.kind) {
            case "equipment":
                return DataEquipment.getById(item.id).name;
            case "key_item":
                return DataKeyItem.getById(item.id).name;
            case "potion":
                return DataPotion.getById(item.id).name;
        }
    }

    export function getFigureObj(item: RpgInventory.Item) {
        switch (item.kind) {
            case "key_item":
                return objFigureKeyItem(item.id);
            case "equipment":
                return objFigureEquipment(item.id);
            case "potion":
                return objFigurePotion(item.id);
        }
    }

    export function getDescription(item: RpgInventory.Item) {
        switch (item.kind) {
            case "equipment":
                return DataEquipment.getById(item.id).description;
            case "key_item":
                return DataKeyItem.getById(item.id).description;
            case "potion":
                return DataPotion.getById(item.id).description;
        }
    }
}
