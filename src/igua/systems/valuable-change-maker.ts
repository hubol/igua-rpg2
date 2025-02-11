import { Logger } from "../../lib/game-engine/logger";
import { RpgEconomy } from "../rpg/rpg-economy";

export namespace ValuableChangeMaker {
    export type Counts = Record<RpgEconomy.Currency.Type, number>;

    export function solveCounts(total: number) {
        const result: Counts = {} as any;

        for (const type of RpgEconomy.Currency.DescendingTypes) {
            const value = RpgEconomy.Currency.Values[type];
            const count = Math.floor(total / value);
            result[type] = count;
            total -= count * value;
        }

        if (total !== 0) {
            Logger.logAssertError("solveCounts", new Error("Did not solveCounts as expected"), {
                total,
                result,
            });
        }

        return result;
    }
}
