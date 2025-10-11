import { PolarInt } from "../../lib/math/number-alias-types";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { IguanaLooks } from "../iguana/looks";
import { RpgAttack } from "./rpg-attack";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";
import { RpgFaction } from "./rpg-faction";
import { RpgFacts } from "./rpg-facts";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPlayerStatus } from "./rpg-player-status";
import { RpgPlayerWallet } from "./rpg-player-wallet";
import { RpgPocket } from "./rpg-pocket";

export class RpgPlayer {
    constructor(
        private readonly _state: RpgPlayer.State,
        readonly attributes: RpgPlayerAttributes,
        private readonly _buffs: RpgPlayerAggregatedBuffs,
        readonly status: RpgPlayerStatus,
        readonly facts: RpgFacts,
        private readonly _reward: RpgExperienceRewarder,
        private readonly _wallet: RpgPlayerWallet,
        private readonly _pocket: RpgPocket,
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
                return 3 + player.attributes.strength * 2
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

    readonly meleeClawWellTimedAttack = (() => {
        const player = this;

        return RpgAttack.create({
            conditions: {
                get poison() {
                    return player.meleeClawAttack.conditions.poison;
                },
            },
            emotional: 0,
            get physical() {
                const base = player.meleeClawAttack.physical;
                const bonus = Math.max(3, Math.ceil(base * 0.3));
                return base + bonus;
            },
            versus: RpgFaction.Enemy,
            quirks: {
                // TODO should it have both player melee quirks?
                isPlayerClawMeleeAttack: true,
            },
        });
    })();

    get looks() {
        return this._state.looks;
    }

    set looks(value) {
        this._state.looks = value;
    }

    get position() {
        return this._state.position;
    }

    die() {
        const valuablesCount = this._wallet.count("valuables");
        this._wallet.spend("valuables", valuablesCount);
        const { totalItems: pocketItemsCount } = this._pocket.empty("death_tax");

        this._reward.spirit.onTaxPocketItemsCount(pocketItemsCount);
        this._reward.spirit.onTaxValuables(valuablesCount);
    }

    revive() {
        this.status.health = this.status.healthMax;
        this.status.conditions.poison.level = Math.min(1, this.status.conditions.poison.level);
    }

    static createState(): RpgPlayer.State {
        return {
            looks: getDefaultLooks(),
            position: {
                facing: 1,
                checkpointName: "",
                sceneName: "",
            },
        };
    }
}

export namespace RpgPlayer {
    export interface State {
        looks: IguanaLooks.Serializable;
        position: Position;
    }

    interface Position {
        facing: PolarInt;
        sceneName: string;
        checkpointName: string;
    }
}
