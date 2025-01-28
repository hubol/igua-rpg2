import { Integer } from "../../lib/math/number-alias-types";
import { NpcPersonaInternalName } from "../data/npc-personas";
import { RpgProgress } from "./rpg-progress";

export const RpgExperienceRewarder = {
    gambling: {
        onPlaceBet(bet: Integer) {
            RpgProgress.character.experience.gambling += bet;
        },
        onWinPrize(prize: Integer) {
            RpgProgress.character.experience.gambling += prize;
        },
    },
    social: {
        onSpeakWithNpc(isFirstTimeSpeaking: boolean) {
            RpgProgress.character.experience.social += isFirstTimeSpeaking ? 10 : 1;
        },
    },
};
