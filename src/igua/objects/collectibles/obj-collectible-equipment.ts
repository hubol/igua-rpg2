import { EquipmentInternalName } from "../../data/data-equipment";
import { mxnCollectible } from "../../mixins/mxn-collectible";
import { RpgProgress } from "../../rpg/rpg-progress";
import { objEquipmentRepresentation } from "../obj-equipment-representation";

// TODO very sad
export function objCollectibleEquipment(name: EquipmentInternalName) {
    return objEquipmentRepresentation(name)
        .pivoted(16, 16)
        .mixin(mxnCollectible, { kind: "transient" })
        .handles("collected", () => RpgProgress.character.equipment.receive(name));
}
