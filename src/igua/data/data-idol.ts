import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { DataKeyItem } from "./data-key-item";
import { DataLib } from "./data-lib";

export namespace DataIdol {
    export interface Model {
        keyItemId: DataKeyItem.Id;
        buffs: RpgPlayerBuffs.MutatorFn;
        hudText: string;
    }

    export const { manifest, getById, filter, find, map } = DataLib.create(
        "DataIdol",
        {
            Yellow: {
                buffs: (model) => {
                    model.loot.valuables.bonus += 10;
                },
                hudText: "Power of the idol reveals more valuables",
                keyItemId: "SeedYellow",
            },
            Green: {
                buffs: (model) => {
                    model.combat.melee.conditions.poison.value += 99;
                    model.combat.melee.conditions.poison.maxLevel += 20;
                },
                hudText: "Power of the idol bestows poison",
                keyItemId: "SeedGreen",
            },
            Blue: {
                buffs: (model) => {
                    model.combat.melee.clawAttack.physical += 8;
                    model.combat.melee.faceAttack.physical += 3;
                },
                hudText: "Power of the idol increases attack power",
                keyItemId: "SeedBlue",
            },
            Purple: {
                buffs: (model) => {
                    model.loot.pocket.bonusChance += 67;
                    model.loot.tiers.nothingRerollCount += 1;
                },
                hudText: "Power of the idol increases luck",
                keyItemId: "SeedPurple",
            },
            __Fallback__: {
                buffs: () => {},
                hudText: "Power of the idol is a bug",
                // TODO idk feels weird
                keyItemId: "IllegalMovie",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;
}
