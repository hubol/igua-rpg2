import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Integer } from "../../lib/math/number-alias-types";
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
                name: "Special Jump God Icon",
                texture: Tx.Collectibles.Equipment.JumpSpecialSigns,
                description: "Increase jump height at special signs",
                buffs: (model, bonus) => model.motion.jump.bonusAtSpecialSigns += 2 * (1 + bonus),
            },
            PoisonRing: {
                name: "Green Drip",
                texture: Tx.Collectibles.Equipment.Poison0,
                description: "Melee attacks apply poison to enemy",
                buffs: (model, bonus) => {
                    model.combat.melee.conditions.poison.value += Math.round(((2 + 1 * bonus) / 3) * 100);
                    model.combat.melee.conditions.poison.maxLevel += 2 + Math.round(bonus * 1.5);
                },
            },
            RichesRing: {
                name: "Luck Coin",
                texture: Tx.Collectibles.Equipment.Wealth0,
                description: "Reduced chance of looting nothing, bonus valuables",
                buffs: (model, bonus) => {
                    model.loot.tiers.nothingRerollCount += 1 + bonus;
                    model.loot.valuables.bonus += 6 + 4 * bonus;
                },
            },
            YellowRichesRing: {
                name: "Luck Coin (Oxidized)",
                texture: Tx.Collectibles.Equipment.Wealth1,
                description: "Increased chance of doubled pocket item loot, bonus valuables",
                buffs: (model, bonus) => {
                    model.loot.pocket.bonusChance += Math.round((0.2 + Math.sqrt(bonus / 5) * 0.8) * 100);
                    model.loot.valuables.bonus += 6 + 4 * bonus;
                },
            },
            NailFile: {
                name: "Vicious Cleat",
                texture: Tx.Collectibles.Equipment.Melee1,
                description: "Bonus claw physical attack",
                // TODO would be cool if stats could be based on player attributes here...
                buffs: (model, bonus) => model.combat.melee.clawAttack.physical += 5 + bonus * 2,
            },
            PatheticCage: {
                name: "Foolish Little Cactus",
                texture: Tx.Collectibles.Equipment.Melee0,
                description: "Modest bonus to physical attack",
                // TODO would be cool if stats could be based on player attributes here...
                buffs: (model, bonus) => {
                    model.combat.melee.attack.physical += 1 + bonus;
                    model.combat.melee.clawAttack.physical += 1 + bonus;
                },
            },
            IqIndicator: {
                name: "IQ Indicator",
                texture: Tx.Collectibles.Equipment.Intelligence0,
                description: "Raises intelligence while worn",
                buffs: (model, bonus) => {
                    model.attributes.intelligence += 1 + bonus;
                },
            },
            FactionDefenseMiner: {
                name: "Commemorative Pillow (Generator Festival)",
                texture: Tx.Collectibles.Equipment.DefenseMiner,
                description: "Defends from attacks from miners",
                buffs: (model, bonus) => {
                    model.combat.defense.faction.miner += Math.min(100, 99 + bonus);
                    if (bonus > 1) {
                        model.loot.valuables.bonus += bonus - 1;
                    }
                },
            },
            BallonLastLonger: {
                name: "Load Lightener",
                texture: null,
                description: "Ballons drain slower",
                buffs: (() => {
                    const values = [50, 67, 75, 80, 85, 90, 93, 95, 97, 98, 99];

                    return (model, bonus) => {
                        const value = values[bonus] ?? values.last;
                        model.conditions.ballonDrainReductionFactor += value;
                        const additionalBonuses = bonus - values.length + 1;
                        if (additionalBonuses > 0) {
                            model.loot.pocket.bonusChance += additionalBonuses;
                            model.loot.valuables.bonus += Math.round(additionalBonuses / 2);
                            model.loot.tiers.nothingRerollCount += Math.round(additionalBonuses / 3);
                        }
                    };
                })(),
            },
            DefensePhysicalAndPerfectBonus: {
                name: "Def. Charm",
                texture: null,
                description: "Increases physical defense, increases attack XP on perfect claw attack",
                buffs: (() => {
                    const values = [10, 15, 20, 25, 30, 32, 34, 36, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];

                    return (model, bonus) => {
                        model.combat.defense.physical += values[bonus] ?? values.last;
                        model.combat.melee.clawAttack.perfect.attackExperience += bonus + 1;
                    };
                })(),
            },
            __Fallback__: {
                name: "???",
                texture: null,
                description: "If you are reading this, it is an error",
                buffs: RpgPlayerBuffs.voidMutator,
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const ids = Object.keys(Manifest) as Id[];

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataEquipment" });

    export const getName = (id: Id, level: Integer) =>
        DataEquipment.getById(id).name + (level < 2 ? "" : (" Lvl." + level));
}
