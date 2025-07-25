import { Integer } from "../../lib/math/number-alias-types";
import { DataPocketItem } from "../data/data-pocket-item";
import { RpgPocket } from "./rpg-pocket";

interface CheckResult_Empty {
    kind: "empty";
    count: 0;
}

interface CheckResult_NotEmpty {
    kind: "not_empty";
    pocketItemId: DataPocketItem.Id;
    count: Integer;
}

const empty: CheckResult_Empty = { kind: "empty", count: 0 };
const notEmpty: CheckResult_NotEmpty = { kind: "not_empty", pocketItemId: "__Fallback__", count: 0 };

export class RpgStashPockets {
    private readonly _cache: Partial<Record<Integer, RpgStashPocket>> = {};

    // TODO should not manipulate state directly, hoe!!
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
        return {};
    }
}

module RpgStashPockets {
    export type State = Record<Integer, { pocketItemId: DataPocketItem.Id; count: Integer }>;
    export type Operation = "withdraw" | "deposit" | "swap";
}

class RpgStashPocket {
    constructor(
        private readonly _state: RpgStashPockets.State,
        private readonly _pocket: RpgPocket,
        private readonly _id: Integer,
    ) {
    }

    check() {
        const deposit = this._state[this._id];
        if (!deposit || deposit.count < 1) {
            return empty;
        }

        notEmpty.count = deposit.count;
        notEmpty.pocketItemId = deposit.pocketItemId;
        return notEmpty;
    }

    checkPossibleOperations(): RpgStashPockets.Operation[] {
        const existingDeposit = this.check();
        const currentSlot = this._pocket.receivingSlot;

        if (existingDeposit.kind === "empty") {
            return currentSlot.isEmpty ? [] : ["deposit"];
        }

        if (existingDeposit.pocketItemId === currentSlot.item) {
            return ["deposit", "withdraw"];
        }

        return currentSlot.isEmpty ? ["withdraw"] : ["swap"];
    }

    deposit() {
        const existingDeposit = this.check();
        const { count, item } = this._pocket.receivingSlot;

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        this._state[this._id] = {
            pocketItemId: item!,
            count: count + existingDeposit.count,
        };

        this._pocket.receivingSlot.force(null, 0, "stash_pocket_operation");
    }

    withdraw() {
        const existingDeposit = this.check();
        const { count } = this._pocket.receivingSlot;

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        if (existingDeposit.kind === "empty") {
            // TODO assert fail
            return;
        }

        delete this._state[this._id];
        this._pocket.receivingSlot.force(
            existingDeposit.pocketItemId,
            count + existingDeposit.count,
            "stash_pocket_operation",
        );
    }

    swap() {
        const existingDeposit = this.check();
        const { count, item, isEmpty } = this._pocket.receivingSlot;

        if (isEmpty) {
            delete this._state[this._id];
        }
        else {
            this._state[this._id] = { count, pocketItemId: item! };
        }

        if (existingDeposit.kind === "not_empty") {
            this._pocket.receivingSlot.force(
                existingDeposit.pocketItemId,
                existingDeposit.count,
                "stash_pocket_operation",
            );
        }
    }
}
