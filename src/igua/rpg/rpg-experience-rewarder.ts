import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { RpgAttack } from "./rpg-attack";
import { RpgExperience } from "./rpg-experience";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPlayerStatus } from "./rpg-player-status";
import { RpgPocket } from "./rpg-pocket";

type ComputerInteractionKind = "noop" | "small_task" | "medium_task";

const computerInteractionsToExperience = {
    noop: 1,
    "small_task": 7,
    "medium_task": 14,
} satisfies Record<ComputerInteractionKind, Integer>;

type SpeakKind = "first_ever" | "first_in_cutscene" | "default";

const speaksToExperience = {
    first_ever: 25,
    first_in_cutscene: 2,
    default: 1,
} satisfies Record<SpeakKind, Integer>;

const rerollCountToExperience = [0, 3, 9, 15, 25, 50, 99];

type IncreaseFn = (amount: Integer) => void;

export class RpgExperienceRewarder {
    constructor(
        private readonly _state: RpgExperience.State,
        private readonly _buffs: RpgPlayerAggregatedBuffs,
        private readonly _status: RpgPlayerStatus,
    ) {
    }

    readonly combat = this._expose("combat", (increase) => ({
        onAttackDamage(attack: RpgAttack.Model, damageDealtToEnemy: Integer) {
            if (attack.quirks.isPlayerClawMeleeAttack) {
                increase(4);
            }
            else if (attack.quirks.isPlayerMeleeAttack) {
                increase(1);
            }
            else {
                // TODO not sure if player should receive XP equal to damage dealt for non-melee attacks. But could be interesting!
                increase(damageDealtToEnemy);
            }
        },
        onEnemyDefeat(enemyMaxHealth: Integer) {
            increase(Math.ceil(enemyMaxHealth / 5));
        },
        onPerfectClawAttack(attackExperience: Integer) {
            if (attackExperience) {
                increase(attackExperience);
            }
        },
    }));

    readonly computer = this._expose("computer", (increase) => ({
        onDepositComputerChips(count: Integer) {
            increase(count * 2);
        },
        onInteract(kind: ComputerInteractionKind) {
            increase(computerInteractionsToExperience[kind]);
        },
    }));

    readonly gambling = this._expose("gambling", (increase) => ({
        onOpenBlindBoxes(count: Integer) {
            increase(count * 5);
        },
        onPlaceBet(bet: Integer) {
            increase(bet);
        },
        onWinPrize(prize: Integer) {
            increase(prize);
        },
        onRerollLoot(rerollLootCounts: Integer[]) {
            const count = rerollLootCounts.reduce((sum, next) => sum + next, 0);

            if (count === 0) {
                return;
            }

            const rawExperience = rerollCountToExperience[count];

            const experience = rawExperience
                ? rawExperience
                : (100 + (count - rerollCountToExperience.length) * 25);
            increase(experience);
        },
    }));

    readonly jump = this._expose("jump", (increase) => ({
        onJump(ballonsCount: Integer, specialBonus: Integer) {
            increase(1 + specialBonus + ballonsCount);
        },
    }));

    readonly pocket = this._expose("pocket", (increase) => ({
        onDiscoverStash() {
            increase(20);
        },
        onReceive(result: RpgPocket.ReceiveResult) {
            if (result.count > 0 && result.count % 10 === 0) {
                increase(10);
            }
            else {
                increase(result.reset ? 2 : 1);
            }
        },
        onRemoveItems(count: Integer, reason: "default" | "death_tax") {
            if (reason === "default") {
                increase(count * 2);
            }
        },
    }));

    readonly quest = this._expose("quest", (increase) => ({
        onComplete(rewardsReceivedCount: Integer, isExtended: boolean) {
            if (isExtended) {
                increase(1);
                return;
            }
            increase(Math.ceil(50 * (1 / Math.pow(2, rewardsReceivedCount - 1))));
        },
    }));

    readonly social = this._expose("social", (increase) => ({
        onNpcSpeak(kind: SpeakKind) {
            increase(speaksToExperience[kind]);
        },
        onTeachFactToClassroom() {
            increase(50);
        },
    }));

    readonly spirit = this._expose("spirit", (increase) => ({
        onTaxPocketItemsCount(pocketItemsCount: Integer) {
            increase(pocketItemsCount);
        },
        onTaxValuables(valuablesCount: Integer) {
            increase(valuablesCount);
        },
    }));

    private _getIncreaseAmount(id: RpgExperience.Id, amount: Integer) {
        const isWet = this._status.conditions.wetness.value >= 1;
        const bonus = isWet ? this._buffs.getAggregatedBuffs().experience.bonusFactorWhileWet[id] : 0;
        if (bonus === 0) {
            return amount;
        }

        const raw = amount * (100 + bonus) / 100;
        const asInteger = Math.floor(raw);
        const fraction = raw - asInteger;

        return asInteger + (Rng.float() < fraction ? 1 : 0);
    }

    private _expose<T>(id: RpgExperience.Id, impl: (increase: IncreaseFn) => T) {
        return impl(amount => this._state[id] += this._getIncreaseAmount(id, amount));
    }
}
