import { Integer } from "../../lib/math/number-alias-types";
import { DeepPartial } from "../../lib/types/deep-partial";
import { RpgFaction } from "./rpg-faction";
import { RpgLoot } from "./rpg-loot";
import { RpgStatus } from "./rpg-status";

export namespace RpgEnemyRank {
    export interface Model {
        status: RpgStatus.Model;
        loot: RpgLoot.Table;
        level: Integer;
    }

    type CreateArgs = DeepPartial<Omit<Model, "loot">> & { loot?: RpgLoot.Table };

    export function create({ status, loot, level }: CreateArgs): Model {
        const healthMax = status?.healthMax ?? status?.health ?? 30;

        return {
            status: {
                health: status?.health ?? status?.healthMax ?? 30,
                healthMax,
                invulnerable: status?.invulnerable ?? 0,
                invulnerableMax: status?.invulnerableMax ?? 10,
                faction: status?.faction ?? RpgFaction.Enemy,
                pride: status?.pride ?? 0,
                conditions: {
                    helium: {
                        ballonDrainFactor: status?.conditions?.helium?.ballonDrainFactor ?? 100,
                        value: status?.conditions?.helium?.value ?? 0,
                        max: status?.conditions?.helium?.max ?? 100,
                        // TODO if it's important, could pass a ballonsCount or something!
                        ballons: [],
                    },
                    poison: {
                        damageScale: status?.conditions?.poison?.damageScale ?? 1,
                        rateFactor: status?.conditions?.poison?.rateFactor ?? 100,
                        value: status?.conditions?.poison?.value ?? 0,
                        max: status?.conditions?.poison?.max ?? 100,
                        level: status?.conditions?.poison?.level ?? 0,
                        levelMax: status?.conditions?.poison?.levelMax ?? 999,
                        immune: status?.conditions?.poison?.immune ?? false,
                        ticksCount: -1,
                    },
                    wetness: {
                        tint: 0xffffff,
                        value: status?.conditions?.wetness?.value ?? 0,
                        max: status?.conditions?.wetness?.max ?? 100,
                    },
                    overheat: {
                        value: status?.conditions?.overheat?.value ?? 0,
                        max: status?.conditions?.overheat?.max ?? 100,
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
                    isImmuneToPlayerMeleeAttack: status?.quirks?.isImmuneToPlayerMeleeAttack ?? false,
                    successfulAttacksRewardExperience: false,
                },
                defenses: {
                    physical: status?.defenses?.physical ?? 0,
                },
                guardingDefenses: {
                    physical: status?.guardingDefenses?.physical ?? 0,
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
                    overheatValueThisTick: 0,
                },
            },
            loot: loot ?? {},
            level: level ?? Math.ceil(healthMax / 5),
        };
    }
}
