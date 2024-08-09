import { Integer } from "../../lib/math/number-alias-types";
import { RpgEnemy } from "./rpg-enemy";

export namespace RpgLoot {
    export interface Model {
        valuables: {
            min: Integer;
            max: Integer;
            deltaShame: Integer;
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
        if (valuables.deltaShame === 0)
            return Math.max(valuables.max, valuables.min);

        const delta = valuables.deltaShame * enemy.shameCount;

        return valuables.deltaShame < 0
            ? Math.max(valuables.min, valuables.max + delta)
            : Math.min(valuables.max, valuables.min + delta);
    }
}