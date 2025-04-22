import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";

export namespace RpgFlops {
    export type Model = Record<Integer, Integer>;

    export function create(): Model {
        return {};
    }

    export const Methods = {
        has(model: Model, index: Integer) {
            return Boolean(model[index]);
        },
        receive(model: Model, index: Integer) {
            if (index < 0 || index > 998 || !Number.isInteger(index)) {
                Logger.logContractViolationError(
                    "RpgFlops.Methods.receive",
                    new Error("index must be integral and in range [0, 998]"),
                    { index },
                );
                return;
            }

            model[index] = (model[index] ?? 0) + 1;
        },
    };
}
