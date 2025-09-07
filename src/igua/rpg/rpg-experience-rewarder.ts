import { Integer } from "../../lib/math/number-alias-types";
import { DataQuest } from "../data/data-quest";
import { RpgAttack } from "./rpg-attack";
import { RpgExperience } from "./rpg-experience";
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

const questComplexityToExperience = {
    easy: 30,
    normal: 100,
} satisfies Record<DataQuest.Complexity, Integer>;

const rerollCountToExperience = [0, 3, 9, 15, 25, 50, 99];

interface RpgExperienceRewarder {
    new(state: RpgExperience.State): ReturnType<typeof createRpgExperienceRewarder>;
}

export const RpgExperienceRewarder = function RpgExperienceRewarder (
    this: RpgExperienceRewarder,
    state: RpgExperience.State,
) {
    Object.assign(this, createRpgExperienceRewarder(state));
} as any as RpgExperienceRewarder;

function createRpgExperienceRewarder(state: RpgExperience.State) {
    return {
        combat: {
            onAttackDamage(attack: RpgAttack.Model, damageDealtToEnemy: Integer) {
                if (attack.quirks.isPlayerClawMeleeAttack) {
                    state.combat += 4;
                }
                else if (attack.quirks.isPlayerMeleeAttack) {
                    state.combat += 1;
                }
                else {
                    // TODO not sure if player should receive XP equal to damage dealt for non-melee attacks. But could be interesting!
                    state.combat += damageDealtToEnemy;
                }
            },
            onEnemyDefeat(enemyMaxHealth: Integer) {
                state.combat += Math.ceil(enemyMaxHealth / 5);
            },
        },
        computer: {
            onDepositComputerChips(count: Integer) {
                state.computer += count * 2;
            },
            onInteract(kind: ComputerInteractionKind) {
                state.computer += computerInteractionsToExperience[kind];
            },
        },
        gambling: {
            onPlaceBet(bet: Integer) {
                state.gambling += bet;
            },
            onWinPrize(prize: Integer) {
                state.gambling += prize;
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
                state.gambling += experience;
            },
        },
        jump: {
            onJump(ballonsCount: Integer, specialBonus: Integer) {
                state.jump += 1 + specialBonus + ballonsCount;
            },
        },
        pocket: {
            onReceive(result: RpgPocket.ReceiveResult) {
                if (result.count > 0 && result.count % 10 === 0) {
                    state.pocket += 10;
                }
                else {
                    state.pocket += result.reset ? 2 : 1;
                }
            },
            onRemoveItems(count: Integer) {
                state.pocket += count * 2;
            },
        },
        quest: {
            onComplete(complexity: DataQuest.Complexity, completionsCount: Integer) {
                state.quest += Math.ceil(
                    questComplexityToExperience[complexity] * (1 / Math.pow(2, completionsCount - 1)),
                );
            },
        },
        social: {
            onNpcSpeak(kind: SpeakKind) {
                state.social += speaksToExperience[kind];
            },
        },
    };
}
