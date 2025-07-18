import { Integer } from "../../lib/math/number-alias-types";
import { DataQuest } from "../data/data-quest";
import { Rpg } from "./rpg";
import { RpgAttack } from "./rpg-attack";
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

export const RpgExperienceRewarder = {
    combat: {
        onAttackDamage(attack: RpgAttack.Model, damageDealtToEnemy: Integer) {
            if (attack.quirks.isPlayerClawMeleeAttack) {
                Rpg.character.experience.combat += 4;
            }
            else if (attack.quirks.isPlayerMeleeAttack) {
                Rpg.character.experience.combat += 1;
            }
            else {
                // TODO not sure if player should receive XP equal to damage dealt for non-melee attacks. But could be interesting!
                Rpg.character.experience.combat += damageDealtToEnemy;
            }
        },
        onEnemyDefeat(enemyMaxHealth: Integer) {
            Rpg.character.experience.combat += Math.ceil(enemyMaxHealth / 5);
        },
    },
    computer: {
        onDepositComputerChips(count: Integer) {
            Rpg.character.experience.computer += count * 2;
        },
        onInteract(kind: ComputerInteractionKind) {
            Rpg.character.experience.computer += computerInteractionsToExperience[kind];
        },
    },
    gambling: {
        onPlaceBet(bet: Integer) {
            Rpg.character.experience.gambling += bet;
        },
        onWinPrize(prize: Integer) {
            Rpg.character.experience.gambling += prize;
        },
    },
    jump: {
        onJump(ballonsCount: Integer, specialBonus: Integer) {
            Rpg.character.experience.jump += 1 + specialBonus + ballonsCount;
        },
    },
    pocket: {
        onReceive(result: RpgPocket.ReceiveResult) {
            if (result.count > 0 && result.count % 10 === 0) {
                Rpg.character.experience.pocket += 10;
            }
            else {
                Rpg.character.experience.pocket += result.reset ? 2 : 1;
            }
        },
        onRemoveItems(count: Integer) {
            Rpg.character.experience.pocket += count * 2;
        },
    },
    quest: {
        onComplete(complexity: DataQuest.Complexity, completionsCount: Integer) {
            Rpg.character.experience.quest += Math.ceil(
                questComplexityToExperience[complexity] * (1 / Math.pow(2, completionsCount - 1)),
            );
        },
    },
    social: {
        onNpcSpeak(kind: SpeakKind) {
            Rpg.character.experience.social += speaksToExperience[kind];
        },
    },
};
