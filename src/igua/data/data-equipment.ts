import { RpgEquipmentAttributes } from "../rpg/rpg-equipment-attributes";

interface Equipment_NoInternalName {
    name: string;
    // TODO description?
    // TODO texture?
    attributes: RpgEquipmentAttributes.Model;
}

const dataEquipment = {
    JumpAtSpecialSignsRing: {
        name: "Special Jumps Ring",
        attributes: RpgEquipmentAttributes.create({ quirks: { enablesHighJumpsAtSpecialSigns: true } }),
    },
    __Empty__: { name: "Empty", attributes: RpgEquipmentAttributes.create({}) },
    __Unknown__: { name: "???", attributes: RpgEquipmentAttributes.create({}) },
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
