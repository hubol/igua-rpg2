import { Integer } from "../../lib/math/number-alias-types";
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
};
