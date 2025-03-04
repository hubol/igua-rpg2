import { Integer } from "../../lib/math/number-alias-types";
import { RpgAttack } from "./rpg-attack";
import { RpgPocket } from "./rpg-pocket";
import { RpgProgress } from "./rpg-progress";

type ComputerInteraction = "noop" | "small-task" | "medium-task";

const computerInteractionsToExperience = {
    noop: 1,
    "small-task": 7,
    "medium-task": 14,
} satisfies Record<ComputerInteraction, Integer>;

export const RpgExperienceRewarder = {
    combat: {
        onAttackDamage(attack: RpgAttack.Model, damageDealtToEnemy: Integer) {
            if (attack.quirks.isPlayerClawMeleeAttack) {
                RpgProgress.character.experience.combat += 3;
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
            RpgProgress.character.experience.combat += Math.ceil(enemyMaxHealth / 3);
        },
    },
    computer: {
        onDepositComputerChips(count: Integer) {
            RpgProgress.character.experience.computer += count * 2;
        },
        onInteract(type: ComputerInteraction) {
            RpgProgress.character.experience.computer += computerInteractionsToExperience[type];
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
    pocket: {
        onReceive(result: RpgPocket.ReceiveResult) {
            RpgProgress.character.experience.pocket += result.reset ? 2 : 1;
        },
        onRemoveItems(count: Integer) {
            RpgProgress.character.experience.pocket += count * 2;
        },
    },
    social: {
        onSpeakWithNpc(isFirstTimeSpeaking: boolean) {
            RpgProgress.character.experience.social += isFirstTimeSpeaking ? 10 : 1;
        },
    },
};
