import { Integer } from "../../lib/math/number-alias-types";
import { RpgFlops } from "./rpg-flops";

export class RpgWeightedPedestals {
    private readonly _cache: Record<Integer, RpgWeightedPedestal> = {};

    constructor(private readonly _state: RpgWeightedPedestals.State) {
    }

    getById(id: Integer, config: RpgWeightedPedestal.Config) {
        if (!this._cache[id]) {
            const state = this._state[id] ?? (this._state[id] = RpgWeightedPedestal.createState());
            return this._cache[id] = new RpgWeightedPedestal(state, config);
        }

        return this._cache[id];
    }

    static createState(): RpgWeightedPedestals.State {
        return {};
    }
}

namespace RpgWeightedPedestals {
    export type State = Record<Integer, RpgWeightedPedestal.State>;
}

export class RpgWeightedPedestal {
    constructor(
        private readonly _state: RpgWeightedPedestal.State,
        private readonly _config: RpgWeightedPedestal.Config,
    ) {
    }

    get isSufficientlyWeighted() {
        return this.weight >= 0;
    }

    get weight() {
        return this._state.placedFlopIds.length - this._config.requiredFlopsCount;
    }

    get list(): ReadonlyArray<RpgFlops.Id> {
        return this._state.placedFlopIds;
    }

    get isEmpty() {
        return this._state.placedFlopIds.length === 0;
    }

    empty(): RpgFlops.Return {
        const request: RpgFlops.Return = { returnedFlopIds: [...this._state.placedFlopIds] };
        this._state.placedFlopIds.length = 0;
        return request;
    }

    receive(loan: RpgFlops.Loan.Accepted) {
        this._state.placedFlopIds.push(loan.flopId);
    }

    static createState(): RpgWeightedPedestal.State {
        return {
            placedFlopIds: [],
        };
    }
}

namespace RpgWeightedPedestal {
    export interface Config {
        requiredFlopsCount: Integer;
    }

    export interface State {
        placedFlopIds: RpgFlops.Id[];
    }
}
