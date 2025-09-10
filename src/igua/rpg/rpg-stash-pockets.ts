import { Integer } from "../../lib/math/number-alias-types";
import { DataPocketItem } from "../data/data-pocket-item";
import { RpgPocket } from "./rpg-pocket";

const empty: RpgStashPocket.CheckBalance.Empty = { kind: "empty", count: 0 };
const notEmpty: RpgStashPocket.CheckBalance.NotEmpty = { kind: "not_empty", pocketItemId: "__Fallback__", count: 0 };

export class RpgStashPockets {
    private readonly _cache: Partial<Record<Integer, RpgStashPocket>> = {};

    constructor(private readonly _state: RpgStashPockets.State, private readonly _pocket: RpgPocket) {
    }

    getById(stashPocketId: Integer) {
        const cache = this._cache[stashPocketId];

        if (cache) {
            return cache;
        }

        return this._cache[stashPocketId] = new RpgStashPocket(this._state, this._pocket, stashPocketId);
    }

    static createState(): RpgStashPockets.State {
        return {
            balances: {},
            discoveredIds: new Set(),
        };
    }
}

namespace RpgStashPockets {
    export interface State {
        balances: Partial<Record<Integer, { pocketItemId: DataPocketItem.Id; count: Integer }>>;
        discoveredIds: Set<Integer>;
    }

    export namespace State {
        export interface Balance {}
    }
}

class RpgStashPocket {
    constructor(
        private readonly _state: RpgStashPockets.State,
        private readonly _pocket: RpgPocket,
        private readonly _id: Integer,
    ) {
    }

    check(): RpgStashPocket.CheckBalance {
        const balance = this._state.balances[this._id];
        if (!balance || balance.count < 1) {
            return empty;
        }

        notEmpty.count = balance.count;
        notEmpty.pocketItemId = balance.pocketItemId;
        return notEmpty;
    }

    checkPossibleOperations(): RpgStashPocket.Operation[] {
        const balance = this.check();
        const currentSlot = this._pocket.receivingSlot;

        if (balance.kind === "empty") {
            return currentSlot.isEmpty ? [] : ["deposit"];
        }

        if (balance.pocketItemId === currentSlot.item) {
            return ["deposit", "withdraw"];
        }

        return currentSlot.isEmpty ? ["withdraw"] : ["swap"];
    }

    deposit() {
        const balance = this.check();
        const { count, item } = this._pocket.receivingSlot;

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        this._state.balances[this._id] = {
            pocketItemId: item!,
            count: count + balance.count,
        };

        this._pocket.receivingSlot.force(null, 0, "stash_pocket_operation");
    }

    withdraw() {
        const balance = this.check();
        const { count } = this._pocket.receivingSlot;

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        if (balance.kind === "empty") {
            // TODO assert fail
            return;
        }

        delete this._state.balances[this._id];
        this._pocket.receivingSlot.force(
            balance.pocketItemId,
            count + balance.count,
            "stash_pocket_operation",
        );
    }

    swap() {
        const balance = this.check();
        const { count, item, isEmpty } = this._pocket.receivingSlot;

        if (isEmpty) {
            delete this._state.balances[this._id];
        }
        else {
            this._state.balances[this._id] = { count, pocketItemId: item! };
        }

        if (balance.kind === "not_empty") {
            this._pocket.receivingSlot.force(
                balance.pocketItemId,
                balance.count,
                "stash_pocket_operation",
            );
        }
    }
}

namespace RpgStashPocket {
    export type CheckBalance = Readonly<CheckBalance.Empty | CheckBalance.NotEmpty>;

    export namespace CheckBalance {
        export interface Empty {
            kind: "empty";
            count: 0;
        }

        export interface NotEmpty {
            kind: "not_empty";
            pocketItemId: DataPocketItem.Id;
            count: Integer;
        }
    }

    export type Operation = "withdraw" | "deposit" | "swap";
}
