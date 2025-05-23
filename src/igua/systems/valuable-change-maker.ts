import { Logger } from "../../lib/game-engine/logger";
import { RpgEconomy } from "../rpg/rpg-economy";

export namespace ValuableChangeMaker {
    export type Counts = Record<RpgEconomy.Valuables.Kind, number>;

    export function solveCounts(total: number) {
        const result: Counts = {} as any;

        for (const type of RpgEconomy.Valuables.DescendingTypes) {
            const value = RpgEconomy.Valuables.Values[type];
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
