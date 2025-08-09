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
                invulnerableMax: status?.invulnerableMax ?? 10,
                faction: status?.faction ?? RpgFaction.Enemy,
                pride: status?.pride ?? 0,
                conditions: {
                    helium: {
                        value: status?.conditions?.helium?.value ?? 0,
                        max: status?.conditions?.helium?.max ?? 100,
                        // TODO if it's important, could pass a ballonsCount or something!
                        ballons: [],
                    },
                    poison: {
                        value: status?.conditions?.poison?.value ?? 0,
                        max: status?.conditions?.poison?.max ?? 100,
                        level: status?.conditions?.poison?.level ?? 0,
                        immune: status?.conditions?.poison?.immune ?? false,
                    },
                    wetness: {
                        tint: 0xffffff,
                        value: status?.conditions?.wetness?.value ?? 0,
                        max: status?.conditions?.wetness?.max ?? 100,
                    },
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
                    isImmuneToPlayerMeleeAttack: status?.quirks?.isImmuneToPlayerMeleeAttack ?? false,
                },
                defenses: {
                    physical: status?.defenses?.physical ?? 0,
                },
                guardingDefenses: {
                    physical: status?.defenses?.physical ?? 0,
                },
                factionDefenses: {
                    [RpgFaction.Anyone]: 0,
                    [RpgFaction.Enemy]: 100,
                    [RpgFaction.Miner]: 0,
                    [RpgFaction.Player]: 0,
                },
                recoveries: {
                    wetness: 1,
                },
                // TODO I don't think this should be passed in!
                state: {
                    ballonHealthMayDrain: false,
                    isGuarding: false,
                },
            },
            loot: loot ?? {},
        };
    }
}
