import { DataFact } from "../data/data-fact";
import { RpgPlayerAttributes } from "./rpg-player-attributes";

const consts = {
    capacities: [1, 5, 9, 12],
};

export class RpgFacts {
    constructor(private readonly _state: RpgFacts.State, private readonly _attributes: RpgPlayerAttributes) {
    }

    memorize(factId: DataFact.Id): RpgFacts.MemorizeResult {
        if (this._state.memorized.has(factId)) {
            return { accepted: false, reason: "already_memorized" };
        }

        if (this.freeSlots <= 0) {
            return { accepted: false, reason: "no_free_slot" };
        }

        this._state.memorized.add(factId);
        return { accepted: true };
    }

    get usedSlots() {
        return this._state.memorized.size;
    }

    get totalSlots() {
        const intelligence = this._attributes.intelligence;

        if (intelligence < consts.capacities.length) {
            return consts.capacities[intelligence];
        }

        const factor = (intelligence - consts.capacities.length) + 1;
        return consts.capacities.last + factor * 3;
    }

    get freeSlots() {
        return Math.max(0, this.totalSlots - this.usedSlots);
    }

    static createState(): RpgFacts.State {
        return {
            memorized: new Set(),
        };
    }
}

export namespace RpgFacts {
    export interface State {
        memorized: Set<DataFact.Id>;
    }

    export type MemorizeResult = MemorizeResult.Accepted | MemorizeResult.Rejected;
    export namespace MemorizeResult {
        export interface Accepted {
            accepted: true;
        }

        export interface Rejected {
            accepted: false;
            reason: "no_free_slot" | "already_memorized";
        }
    }
}
