import { RpgAttack } from "./rpg-attack";
import { RpgFaction } from "./rpg-faction";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPlayerStatus } from "./rpg-player-status";

export class RpgPlayer {
    constructor(
        readonly attributes: RpgPlayerAttributes,
        private readonly _buffs: RpgPlayerAggregatedBuffs,
        readonly status: RpgPlayerStatus,
    ) {
    }

    get buffs() {
        return this._buffs.getAggregatedBuffs();
    }

    readonly motion = (() => {
        const player = this;

        return {
            // TODO some of these "motion" modifications are computed in objPlayer. Pick a place!
            get bouncingMinSpeed() {
                return Math.min(4, 2.5 + player.status.conditions.poison.level * 0.25);
            },
        };
    })();

    readonly meleeAttack = (() => {
        const player = this;

        return RpgAttack.create({
            conditions: {
                get poison() {
                    return player.buffs.combat.melee.conditions.poison;
                },
            },
            emotional: 0,
            get physical() {
                return 4 + player.attributes.strength * 3
                    + player.buffs.combat.melee.attack.physical;
            },
            versus: RpgFaction.Enemy,
            quirks: {
                isPlayerMeleeAttack: true,
            },
        });
    })();

    readonly meleeClawAttack = (() => {
        const player = this;

        return RpgAttack.create({
            conditions: {
                get poison() {
                    return player.buffs.combat.melee.conditions.poison;
                },
            },
            emotional: 0,
            get physical() {
                return 5 + player.attributes.strength * 5
                    + player.buffs.combat.melee.clawAttack.physical;
            },
            versus: RpgFaction.Enemy,
            quirks: {
                // TODO should it have both player melee quirks?
                isPlayerClawMeleeAttack: true,
            },
        });
    })();
}

export module RpgPlayer {
    export interface State {
        // TODO
    }
}
