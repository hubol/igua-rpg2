import { Integer } from "../../lib/math/number-alias-types";
import { RpgAttack } from "./rpg-attack";
import { RpgPocket } from "./rpg-pocket";
import { RpgProgress } from "./rpg-progress";
import { RpgQuests } from "./rpg-quests";

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
} satisfies Record<RpgQuests.Complexity, Integer>;

export const RpgExperienceRewarder = {
    combat: {
        onAttackDamage(attack: RpgAttack.Model, damageDealtToEnemy: Integer) {
            if (attack.quirks.isPlayerClawMeleeAttack) {
                RpgProgress.character.experience.combat += 4;
            }
            else if (attack.quirks.isPlayerMeleeAttack) {
                RpgProgress.character.experience.combat += 1;
            }
            else {
                // TODO not sure if player should receive XP equal to damage dealt for non-melee attacks. But could be interesting!
                RpgProgress.character.experience.combat += damageDealtToEnemy;
            }
        },
        onEnemyDefeat(enemyMaxHealth: Integer) {
            RpgProgress.character.experience.combat += Math.ceil(enemyMaxHealth / 5);
        },
    },
    computer: {
        onDepositComputerChips(count: Integer) {
            RpgProgress.character.experience.computer += count * 2;
        },
        onInteract(kind: ComputerInteractionKind) {
            RpgProgress.character.experience.computer += computerInteractionsToExperience[kind];
        },
    },
    gambling: {
        onPlaceBet(bet: Integer) {
            RpgProgress.character.experience.gambling += bet;
        },
        onWinPrize(prize: Integer) {
            RpgProgress.character.experience.gambling += prize;
        },
    },
    jump: {
        onJump(ballonsCount: Integer, specialBonus: Integer) {
            RpgProgress.character.experience.jump += 1 + specialBonus + ballonsCount;
        },
    },
    pocket: {
        onReceive(result: RpgPocket.ReceiveResult) {
            if (result.count > 0 && result.count % 10 === 0) {
                RpgProgress.character.experience.pocket += 10;
            }
            else {
                RpgProgress.character.experience.pocket += result.reset ? 2 : 1;
            }
        },
        onRemoveItems(count: Integer) {
            RpgProgress.character.experience.pocket += count * 2;
        },
    },
    quest: {
        onComplete(complexity: RpgQuests.Complexity, completionsCount: Integer) {
            RpgProgress.character.experience.quest += Math.ceil(
                questComplexityToExperience[complexity] * (1 / Math.pow(2, completionsCount - 1)),
            );
        },
    },
    social: {
        onNpcSpeak(kind: SpeakKind) {
            RpgProgress.character.experience.social += speaksToExperience[kind];
        },
    },
};
