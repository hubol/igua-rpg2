import { Integer } from "../../lib/math/number-alias-types";
import { RpgProgress } from "./rpg-progress";

export const RpgExperienceRewarder = {
    combat: {
        onAttackDamage(damage: Integer) {
            RpgProgress.character.experience.combat += damage;
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
