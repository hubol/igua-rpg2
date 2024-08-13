import { Integer } from "../../lib/math/number-alias-types";
import { RpgEnemy } from "./rpg-enemy";

export namespace RpgLoot {
    export interface Model {
        valuables: {
            min: Integer;
            max: Integer;
            deltaPride: Integer;
        }
    }

    export interface Drop {
        valuables: Integer;
    }

    export const Methods = {
        drop(model: Model, enemy: RpgEnemy.Model): Drop {
            return {
                valuables: computeValuables(model.valuables, enemy),
            };
        }
    }

    function computeValuables(valuables: Model['valuables'], enemy: RpgEnemy.Model): Integer {
        if (valuables.deltaPride === 0)
            return Math.max(valuables.max, valuables.min);

        const delta = valuables.deltaPride * enemy.pride;

        return valuables.deltaPride < 0
            ? Math.max(valuables.min, valuables.max + delta)
            : Math.min(valuables.max, valuables.min + delta);
    }
}