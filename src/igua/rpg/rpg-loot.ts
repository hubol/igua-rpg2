import { Integer } from "../../lib/math/number-alias-types";
import { RpgStatus } from "./rpg-status";

export namespace RpgLoot {
    export interface Model {
        valuables: {
            min: Integer;
            max: Integer;
            deltaPride: Integer;
        };
    }

    export interface Drop {
        valuables: Integer;
    }

    export const Methods = {
        drop(model: Model, dropperStatus: RpgStatus.Model): Drop {
            return {
                valuables: computeValuables(model.valuables, dropperStatus),
            };
        },
    };

    function computeValuables(valuables: Model["valuables"], dropperStatus: RpgStatus.Model): Integer {
        if (valuables.deltaPride === 0) {
            return Math.max(valuables.max, valuables.min);
        }

        const delta = valuables.deltaPride * dropperStatus.pride;

        return valuables.deltaPride < 0
            ? Math.max(valuables.min, valuables.max + delta)
            : Math.min(valuables.max, valuables.min + delta);
    }
}
