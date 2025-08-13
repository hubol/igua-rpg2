import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";

export class RpgFlops {
    constructor(private readonly _state: RpgFlops.State) {
    }

    /** Generally, prefer the `count` and `has` methods */
    get values(): Readonly<RpgFlops.State> {
        return this._state;
    }

    count(index: Integer) {
        return this._state[index] ?? 0;
    }

    has(index: Integer) {
        return Boolean(this._state[index]);
    }

    receive(index: Integer) {
        if (index < 0 || index > 998 || !Number.isInteger(index)) {
            Logger.logContractViolationError(
                "RpgFlops.Methods.receive",
                new Error("index must be integral and in range [0, 998]"),
                { index },
            );
            return;
        }

        this._state[index] = this.count(index) + 1;
    }

    static createState(): RpgFlops.State {
        return {};
    }
}

export module RpgFlops {
    export type State = Record<Integer, Integer>;
}
