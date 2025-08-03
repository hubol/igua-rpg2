import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { DataKeyItem } from "./data-key-item";
import { DataLib } from "./data-lib";

export namespace DataIdol {
    export interface Model {
        keyItemId: DataKeyItem.Id;
        buffs: RpgPlayerBuffs.MutatorFn;
        hudText: string;
    }

    export const Manifest = DataLib.createManifest(
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
                    model.combat.melee.conditions.poison += 100;
                },
                hudText: "Power of the idol bestows poison",
                keyItemId: "SeedGreen",
            },
            Blue: {
                buffs: (model) => {
                    model.combat.melee.clawAttack.physical += 3;
                    model.combat.melee.attack.physical += 3;
                },
                hudText: "Power of the idol increases attack power",
                keyItemId: "SeedBlue",
            },
            Purple: {
                buffs: (model) => {
                    model.loot.pocket.bonusChance += 67;
                },
                hudText: "Power of the idol increases luck",
                keyItemId: "SeedPurple",
            },
            __Fallback__: {
                buffs: () => {},
                hudText: "Power of the idol is a bug",
                keyItemId: "__Fallback__",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({
        manifest: Manifest,
        namespace: "DataIdol",
    });
}
