import { Integer } from "../../lib/math/number-alias-types";
import { RpgProgress } from "./rpg-progress";

type ComputerInteraction = "noop" | "small-task" | "medium-task";

const computerInteractionsToExperience = {
    noop: 1,
    "small-task": 7,
    "medium-task": 14,
} satisfies Record<ComputerInteraction, Integer>;

export const RpgExperienceRewarder = {
    combat: {
        onEnemyDefeat(enemyMaxHealth: Integer) {
            RpgProgress.character.experience.combat += enemyMaxHealth;
        },
    },
    computer: {
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
        onRemoveItems(count: Integer) {
            RpgProgress.character.experience.pocket += count;
        },
    },
    social: {
        onSpeakWithNpc(isFirstTimeSpeaking: boolean) {
            RpgProgress.character.experience.social += isFirstTimeSpeaking ? 10 : 1;
        },
    },
};
