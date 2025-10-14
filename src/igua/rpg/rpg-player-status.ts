import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { RpgFaction } from "./rpg-faction";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgStatus } from "./rpg-status";

export class RpgPlayerStatus implements RpgStatus.Model {
    constructor(
        private readonly _state: RpgPlayerStatus.State,
        private readonly _attributes: RpgPlayerAttributes,
        private readonly _buffs: RpgPlayerAggregatedBuffs,
    ) {
    }

    readonly state = { ballonHealthMayDrain: false, isGuarding: false };

    get health() {
        return this._state.health;
    }

    set health(value) {
        this._state.health = value;
    }

    get healthMax() {
        return 45 + this._attributes.health * 5;
    }

    get invulnerable() {
        return this._state.invulnerable;
    }

    set invulnerable(value) {
        this._state.invulnerable = value;
    }

    get isAlive() {
        return this._state.health > 0;
    }

    readonly invulnerableMax = 60;

    pride = 0;

    readonly conditions = ((): RpgStatus.Model["conditions"] => {
        const buffs = this._buffs;
        const state = this._state;

        return ({
            helium: {
                get ballonDrainFactor() {
                    return 100 - buffs.getAggregatedBuffs().conditions.ballonDrainReductionFactor;
                },
                get ballons() {
                    return state.conditions.helium.ballons;
                },
                get value() {
                    return state.conditions.helium.value;
                },
                set value(value) {
                    state.conditions.helium.value = value;
                },
                max: 100,
            },
            poison: {
                immune: false,
                max: 100,
                get level() {
                    return state.conditions.poison.level;
                },
                set level(value) {
                    state.conditions.poison.level = value;
                },
                ticksCount: -1,
                get value() {
                    return state.conditions.poison.value;
                },
                set value(value) {
                    state.conditions.poison.value = value;
                },
            },
            wetness: {
                get tint() {
                    return state.conditions.wetness.tint;
                },
                set tint(value) {
                    state.conditions.wetness.tint = value;
                },
                get value() {
                    return state.conditions.wetness.value;
                },
                set value(value) {
                    state.conditions.wetness.value = value;
                },
                max: 100,
            },
        });
    })();

    readonly guardingDefenses = (() => {
        const self = this;

        return {
            get physical() {
                return self.defenses.physical + 20;
            },
        };
    })();

    readonly defenses = (() => {
        const buffs = this._buffs;

        return {
            get physical() {
                return buffs.getAggregatedBuffs().combat.defense.physical;
            },
        };
    })();

    readonly factionDefenses = (() => {
        const buffs = this._buffs;

        return {
            [RpgFaction.Anyone]: 0,
            [RpgFaction.Enemy]: 0,
            [RpgFaction.Player]: 100,
            get [RpgFaction.Miner]() {
                return buffs.getAggregatedBuffs().combat.defense.faction.miner;
            },
        };
    })();

    readonly recoveries = {
        wetness: 1,
    };

    readonly faction = RpgFaction.Player;

    readonly quirks = {
        emotionalDamageIsFatal: true,
        incrementsAttackerPrideOnDamage: true,
        roundReceivedDamageUp: false,
        guardedDamageIsFatal: false,
        ailmentsRecoverWhileCutsceneIsPlaying: false,
        receivesDamageWhileCutsceneIsPlaying: false,
        attackingRewardsExperience: true,
        isImmuneToPlayerMeleeAttack: true,
    };

    static createState(): RpgPlayerStatus.State {
        return {
            conditions: {
                helium: {
                    ballons: [],
                    value: 0,
                },
                poison: {
                    level: 0,
                    value: 0,
                },
                wetness: {
                    tint: 0xffffff,
                    value: 0,
                },
            },
            health: 50,
            invulnerable: 0,
        };
    }
}

export namespace RpgPlayerStatus {
    export interface State {
        health: Integer;
        invulnerable: Integer;
        conditions: {
            helium: {
                ballons: RpgStatus.Ballon[];
                value: Integer;
            };
            poison: {
                level: Integer;
                value: Integer;
            };
            wetness: {
                tint: RgbInt;
                value: Integer;
            };
        };
    }
}
