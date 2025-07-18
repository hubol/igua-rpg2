import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { DataKeyItem } from "./data-key-item";
import { DataLib } from "./data-lib";

export namespace DataIdol {
    export interface Model {
        keyItemId: DataKeyItem.Id;
        buffs: RpgPlayerBuffs.MutatorFn;
    }

    export const Manifest = DataLib.createManifest(
        {
            Yellow: {
                buffs: (model) => {
                    model.loot.valuables.bonus += 10;
                },
                keyItemId: "SeedYellow",
            },
            Green: {
                buffs: (model) => {
                    model.combat.melee.conditions.poison += 100;
                },
                keyItemId: "SeedGreen",
            },
            Blue: {
                buffs: (model) => {
                    model.combat.melee.attack.physical += 3;
                },
                keyItemId: "SeedBlue",
            },
            Purple: {
                buffs: (model) => {
                    model.loot.pocket.bonusChance += 25;
                },
                keyItemId: "SeedPurple",
            },
            __Fallback__: {
                buffs: () => {},
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
