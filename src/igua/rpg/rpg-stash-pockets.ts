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
    // TODO should not manipulate state directly, hoe!!
    constructor(private readonly _state: RpgStashPockets.State, private readonly _pocket: RpgPocket) {
    }

    check(stashPocketId: Integer) {
        const deposit = this._state[stashPocketId];
        if (!deposit || deposit.count < 1) {
            return empty;
        }

        notEmpty.count = deposit.count;
        notEmpty.pocketItemId = deposit.pocketItemId;
        return notEmpty;
    }

    checkPossibleOperations(stashPocketId: Integer): RpgStashPockets.Operation[] {
        const existingDeposit = this.check(stashPocketId);
        const currentSlot = this._pocket.receivingSlot;

        if (existingDeposit.kind === "empty") {
            return currentSlot.isEmpty ? [] : ["deposit"];
        }

        if (existingDeposit.pocketItemId === currentSlot.item) {
            return ["deposit", "withdraw"];
        }

        return currentSlot.isEmpty ? ["withdraw"] : ["swap"];
    }

    deposit(stashPocketId: Integer) {
        const existingDeposit = this.check(stashPocketId);
        const { count, item } = this._pocket.receivingSlot;

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        this._state[stashPocketId] = {
            pocketItemId: item!,
            count: count + existingDeposit.count,
        };

        this._pocket.receivingSlot.force(null, 0, "stash_pocket_operation");
    }

    withdraw(stashPocketId: Integer) {
        const existingDeposit = this.check(stashPocketId);
        const { count } = this._pocket.receivingSlot;

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        if (existingDeposit.kind === "empty") {
            // TODO assert fail
            return;
        }

        delete this._state[stashPocketId];
        this._pocket.receivingSlot.force(
            existingDeposit.pocketItemId,
            count + existingDeposit.count,
            "stash_pocket_operation",
        );
    }

    swap(stashPocketId: Integer) {
        const existingDeposit = this.check(stashPocketId);
        const { count, item, isEmpty } = this._pocket.receivingSlot;

        if (isEmpty) {
            delete this._state[stashPocketId];
        }
        else {
            this._state[stashPocketId] = { count, pocketItemId: item! };
        }

        if (existingDeposit.kind === "not_empty") {
            this._pocket.receivingSlot.force(
                existingDeposit.pocketItemId,
                existingDeposit.count,
                "stash_pocket_operation",
            );
        }
    }

    static createState(): RpgStashPockets.State {
        return {};
    }
}

module RpgStashPockets {
    export type State = Record<Integer, { pocketItemId: DataPocketItem.Id; count: Integer }>;
    export type Operation = "withdraw" | "deposit" | "swap";
}
