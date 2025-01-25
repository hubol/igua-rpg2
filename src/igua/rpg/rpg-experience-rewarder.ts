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
        onSpeakWithNpc(name: NpcPersonaInternalName) {
            if (RpgProgress.uids.metNpcs.has(name)) {
                return;
            }

            RpgProgress.uids.metNpcs.add(name);
            RpgProgress.character.experience.social += 1;
        },
    },
};
