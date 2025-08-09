import { Texture } from "pixi.js";
import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { DataLib } from "./data-lib";

export namespace DataEquipment {
    export interface Model {
        name: string;
        description: string;
        buffs: RpgPlayerBuffs.MutatorFn;
        texture: Texture | null;
    }

    export const Manifest = DataLib.createManifest(
        {
            JumpAtSpecialSignsRing: {
                name: "Special Jumps Ring",
                description: "Increase jump height at special signs",
                buffs: (model, bonus) => model.motion.jump.bonusAtSpecialSigns += 2 * (1 + bonus),
                texture: null,
            },
            PoisonRing: {
                name: "Pzzn Ring",
                description: "Melee attacks apply poison to enemy",
                buffs: (model, bonus) =>
                    model.combat.melee.conditions.poison += Math.round(((2 + 1 * bonus) / 3) * 100),
                texture: null,
            },
            RichesRing: {
                name: "Riches Ring",
                description: "Reduced chance of looting nothing, bonus valuables",
                buffs: (model, bonus) => {
                    model.loot.tiers.nothingRerollCount += 1 + bonus;
                    model.loot.valuables.bonus += 6 + 4 * bonus;
                },
                texture: null,
            },
            YellowRichesRing: {
                name: "Riches Ring (Yellow)",
                description: "Increased chance of doubled pocket item loot, bonus valuables",
                buffs: (model, bonus) => {
                    model.loot.pocket.bonusChance += Math.round((0.2 + Math.sqrt(bonus / 5) * 0.8) * 100);
                    model.loot.valuables.bonus += 6 + 4 * bonus;
                },
                texture: null,
            },
            NailFile: {
                name: "Nail File",
                description: "Bonus claw physical attack",
                // TODO would be cool if stats could be based on player attributes here...
                buffs: (model, bonus) => model.combat.melee.clawAttack.physical += 5 + bonus * 2,
                texture: null,
            },
            PatheticCage: {
                name: "Pathetic Cage",
                description: "Modest bonus to physical attack",
                // TODO would be cool if stats could be based on player attributes here...
                buffs: (model, bonus) => {
                    model.combat.melee.attack.physical += 1 + bonus;
                    model.combat.melee.clawAttack.physical += 1 + bonus;
                },
                texture: null,
            },
            IqIndicator: {
                name: "IQ Indicator",
                description: "Raises intelligence while worn",
                buffs: (model, bonus) => {
                    model.attributes.intelligence += 1 + bonus;
                },
                texture: null,
            },
            __Empty__: {
                name: "Empty",
                description: "Void",
                buffs: RpgPlayerBuffs.voidMutator,
                texture: null,
            },
            __Fallback__: {
                name: "???",
                description: "If you are reading this, it is an error",
                buffs: RpgPlayerBuffs.voidMutator,
                texture: null,
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataEquipment" });
}
