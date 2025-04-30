import { RpgEquipmentAttributes } from "../rpg/rpg-equipment-attributes";

interface Equipment_NoInternalName {
    name: string;
    description: string;
    // TODO texture?
    attributes: RpgEquipmentAttributes.Model;
}

const dataEquipment = {
    JumpAtSpecialSignsRing: {
        name: "Special Jumps Ring",
        description: "Increase jump height at special signs",
        attributes: RpgEquipmentAttributes.create({ quirks: { enablesHighJumpsAtSpecialSigns: true } }),
    },
    __Empty__: {
        name: "Empty",
        description: "Void",
        attributes: RpgEquipmentAttributes.create({}),
    },
    __Unknown__: {
        name: "???",
        description: "If you are reading this, it is an error",
        attributes: RpgEquipmentAttributes.create({}),
    },
} satisfies Record<string, Equipment_NoInternalName>;

export type EquipmentInternalName = keyof typeof dataEquipment;

type Equipment = Equipment_NoInternalName & { internalName: EquipmentInternalName };

export const DataEquipment = Object.entries(dataEquipment).reduce(
    (obj, [internalName, npcPersona]) => {
        obj[internalName] = npcPersona;
        return obj;
    },
    {} as Record<EquipmentInternalName, Equipment>,
);
