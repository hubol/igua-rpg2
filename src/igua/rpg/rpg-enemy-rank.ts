import { DeepPartial } from "../../lib/types/deep-partial";
import { RpgFaction } from "./rpg-faction";
import { RpgLoot } from "./rpg-loot";
import { RpgStatus } from "./rpg-status";

export namespace RpgEnemyRank {
    export interface Model {
        status: RpgStatus.Model;
        loot: RpgLoot.Model;
    }

    type CreateArgs = DeepPartial<Omit<Model, "loot">> & { loot?: RpgLoot.Model };

    export function create({ status, loot }: CreateArgs): Model {
        return {
            status: {
                health: status?.health ?? status?.healthMax ?? 30,
                healthMax: status?.healthMax ?? status?.health ?? 30,
                invulnerable: status?.invulnerable ?? 0,
                invulnerableMax: status?.invulnerableMax ?? 15,
                isGuarding: false,
                faction: status?.faction ?? RpgFaction.Enemy,
                pride: status?.pride ?? 0,
                poison: {
                    value: status?.poison?.value ?? 0,
                    max: status?.poison?.max ?? 100,
                    level: status?.poison?.level ?? 0,
                    immune: status?.poison?.immune ?? false,
                },
                wetness: {
                    tint: 0xffffff,
                    value: status?.wetness?.value ?? 0,
                    max: status?.wetness?.max ?? 100,
                },
                quirks: {
                    emotionalDamageIsFatal: status?.quirks?.emotionalDamageIsFatal ?? false,
                    incrementsAttackerPrideOnDamage: status?.quirks?.incrementsAttackerPrideOnDamage ?? false,
                    roundReceivedDamageUp: status?.quirks?.roundReceivedDamageUp ?? true,
                    guardedDamageIsFatal: status?.quirks?.guardedDamageIsFatal ?? true,
                    ailmentsRecoverWhileCutsceneIsPlaying: status?.quirks?.ailmentsRecoverWhileCutsceneIsPlaying
                        ?? true,
                    receivesDamageWhileCutsceneIsPlaying: status?.quirks?.receivesDamageWhileCutsceneIsPlaying ?? true,
                    attackingRewardsExperience: status?.quirks?.attackingRewardsExperience ?? false,
                },
                defenses: {
                    physical: status?.defenses?.physical ?? 0,
                },
                guardingDefenses: {
                    physical: status?.defenses?.physical ?? 0,
                },
                recoveries: {
                    wetness: 1,
                },
            },
            loot: loot ?? {},
        };
    }
}
