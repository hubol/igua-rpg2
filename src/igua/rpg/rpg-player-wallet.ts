import { Integer } from "../../lib/math/number-alias-types";
import { Rpg } from "./rpg";
import { RpgEconomy } from "./rpg-economy";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export namespace RpgPlayerWallet {
    export function getHeldAmount(currency: RpgEconomy.Currency.Model) {
        if (currency === "valuables") {
            return Rpg.character.inventory.valuables;
        }
        else if (currency === "mechanical_idol_credits") {
            return Rpg.flags.newBalltown.mechanicalIdol.credits;
        }

        const experience = currency.experience;
        return Rpg.character.experience[experience];
    }

    export function hasNone(currency: RpgEconomy.Currency.Model) {
        return getHeldAmount(currency) === 0;
    }

    export type ExpenseKind = "default" | "gambling";

    function update(currency: RpgEconomy.Currency.Model, delta: Integer) {
        if (currency === "valuables") {
            Rpg.character.inventory.valuables += delta;
            return;
        }
        else if (currency === "mechanical_idol_credits") {
            Rpg.flags.newBalltown.mechanicalIdol.credits += delta;
            return;
        }

        const experience = currency.experience;
        Rpg.character.experience[experience] += delta;
    }

    export function spend(currency: RpgEconomy.Currency.Model, cost: Integer, kind: ExpenseKind = "default") {
        // TODO assert valuables >= cost

        update(currency, -cost);

        if (kind === "gambling") {
            RpgExperienceRewarder.gambling.onPlaceBet(cost);
        }
    }

    export type IncomeSource = "default" | "gambling";

    export function earn(
        currency: RpgEconomy.Currency.Model,
        income: Integer,
        source: IncomeSource = "default",
    ) {
        // TODO assert income > 0

        update(currency, income);

        if (source === "gambling") {
            RpgExperienceRewarder.gambling.onWinPrize(income);
        }
    }
}
