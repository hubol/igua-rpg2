import { Integer } from "../../lib/math/number-alias-types";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";
import { RpgProgress } from "./rpg-progress";

export namespace RpgPlayerWallet {
    export function isEmpty() {
        return RpgProgress.character.inventory.valuables < 1;
    }

    export function hasValuables(count: Integer) {
        return RpgProgress.character.inventory.valuables >= count;
    }

    export type ExpenseKind = "default" | "gambling";

    export function spendValuables(cost: Integer, kind: ExpenseKind = "default") {
        // TODO assert valuables >= cost

        RpgProgress.character.inventory.valuables -= cost;

        if (kind === "gambling") {
            RpgExperienceRewarder.gambling.onPlaceBet(cost);
        }
    }

    export type IncomeSource = "default" | "gambling";

    export function receiveValuables(income: Integer, source: IncomeSource = "default") {
        // TODO assert income > 0

        RpgProgress.character.inventory.valuables += income;

        if (source === "gambling") {
            RpgExperienceRewarder.gambling.onWinPrize(income);
        }
    }
}
