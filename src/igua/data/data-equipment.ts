import { RpgEquipmentEffects } from "../rpg/rpg-equipment-effects";

interface Equipment_NoInternalName {
    name: string;
    description: string;
    // TODO texture?
    effects: RpgEquipmentEffects.MutatorFn;
}

const voidEffects: RpgEquipmentEffects.MutatorFn = () => {};

export const DataEquipment = {
    JumpAtSpecialSignsRing: {
        name: "Special Jumps Ring",
        description: "Increase jump height at special signs",
        effects: (model, bonus) => model.motion.jump.bonusAtSpecialSigns += 2 * (1 + bonus),
    },
    PoisonRing: {
        name: "Pzzn Ring",
        description: "Melee attacks apply poison to enemy",
        effects: (model, bonus) => model.combat.melee.conditions.poison += Math.round(((2 + 1 * bonus) / 3) * 100),
    },
    RichesRing: {
        name: "Riches Ring",
        description: "Reduced chance of looting nothing, bonus valuables",
        effects: (model, bonus) => {
            model.loot.tiers.nothingRerollCount += 1 + bonus;
            model.loot.valuables.bonus += 6 + 4 * bonus;
        },
    },
    YellowRichesRing: {
        name: "Riches Ring (Yellow)",
        description: "Increased chance of doubled pocket item loot, bonus valuables",
        effects: (model, bonus) => {
            model.loot.pocket.bonusChance += Math.round((0.2 + Math.sqrt(bonus / 5) * 0.8) * 100);
            model.loot.valuables.bonus += 6 + 4 * bonus;
        },
    },
    NailFile: {
        name: "Nail File",
        description: "Bonus claw physical attack",
        // TODO would be cool if stats could be based on player attributes here...
        effects: (model, bonus) => model.combat.melee.clawAttack.physical += 5 + bonus * 2,
    },
    PatheticCage: {
        name: "Pathetic Cage",
        description: "Modest bonus to physical attack",
        // TODO would be cool if stats could be based on player attributes here...
        effects: (model, bonus) => {
            model.combat.melee.attack.physical += 1 + bonus;
            model.combat.melee.clawAttack.physical += 1 + bonus;
        },
    },
    __Empty__: {
        name: "Empty",
        description: "Void",
        effects: voidEffects,
    },
    __Unknown__: {
        name: "???",
        description: "If you are reading this, it is an error",
        effects: voidEffects,
    },
} satisfies Record<string, Equipment_NoInternalName>;

// TODO prefix with Data I think?
export type EquipmentInternalName = keyof typeof DataEquipment;

// TODO i hate global namespace stuff beginning with get
export function getDataEquipment(name: EquipmentInternalName) {
    // TODO warn if undefined?
    return DataEquipment[name] ?? DataEquipment.__Unknown__;
}
