import { DeepPartial } from "../../lib/types/deep-partial";
import { RpgFaction } from "./rpg-faction";
import { RpgLoot } from "./rpg-loot";
import { RpgStatus } from "./rpg-status";

export namespace RpgEnemyClass {
    export interface Model {
        status: RpgStatus.Model;
        loot: RpgLoot.Model;
    }

    export function create({ status, loot }: DeepPartial<Model>): Model {
        return {
            status: {
                health: status?.health ?? status?.healthMax ?? 30,
                healthMax: status?.healthMax ?? status?.health ?? 30,
                invulnerable: status?.invulnerable ?? 0,
                invulnerableMax: status?.invulnerableMax ?? 15,
                faction: status?.faction ?? RpgFaction.Enemy,
                poison: {
                    value: status?.poison?.value ?? 0,
                    max: status?.poison?.max ?? 100,
                    level: status?.poison?.level ?? 0,
                },
                quirks: {
                    emotionalDamageIsFatal: status?.quirks?.emotionalDamageIsFatal ?? false,
                    incrementsAttackerPrideOnDamage: status?.quirks?.incrementsAttackerPrideOnDamage ?? false,
                },
            },
            loot: {
                valuables: {
                    min: loot?.valuables?.min ?? 1,
                    max: loot?.valuables?.max ?? 2,
                    deltaPride: loot?.valuables?.deltaPride ?? -1,
                }
            }
        }
    }
}