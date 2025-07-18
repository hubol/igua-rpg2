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
    constructor(private readonly _state: RpgStashPockets.State, private readonly _pocket: RpgPocket.Model) {
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
        // TODO should be exposed on a pocket method!
        const currentSlot = this._pocket.slots[this._pocket.nextSlotIndex];

        if (existingDeposit.kind === "empty") {
            return currentSlot.count === 0 ? [] : ["deposit"];
        }

        if (existingDeposit.pocketItemId === currentSlot.item) {
            return ["deposit", "withdraw"];
        }

        // TODO all the count === 0 or !item checks suck
        return (currentSlot.count === 0 || !currentSlot.item) ? ["withdraw"] : ["swap"];
    }

    deposit(stashPocketId: Integer) {
        const existingDeposit = this.check(stashPocketId);
        const { count, item } = this._pocket.slots[this._pocket.nextSlotIndex];

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        this._state[stashPocketId] = {
            pocketItemId: item!,
            count: count + existingDeposit.count,
        };

        this._pocket.slots[this._pocket.nextSlotIndex].item = null;
        this._pocket.slots[this._pocket.nextSlotIndex].count = 0;
    }

    withdraw(stashPocketId: Integer) {
        const existingDeposit = this.check(stashPocketId);
        const { count } = this._pocket.slots[this._pocket.nextSlotIndex];

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        if (existingDeposit.kind === "empty") {
            // TODO assert fail
            return;
        }

        delete this._state[stashPocketId];
        this._pocket.slots[this._pocket.nextSlotIndex].item = existingDeposit.pocketItemId;
        this._pocket.slots[this._pocket.nextSlotIndex].count = count + existingDeposit.count;
    }

    swap(stashPocketId: Integer) {
        const existingDeposit = this.check(stashPocketId);
        const { count, item } = this._pocket.slots[this._pocket.nextSlotIndex];

        if (count === 0 || !item) {
            delete this._state[stashPocketId];
        }
        else {
            this._state[stashPocketId] = { count, pocketItemId: item };
        }

        if (existingDeposit.kind === "not_empty") {
            this._pocket.slots[this._pocket.nextSlotIndex].item = existingDeposit.pocketItemId;
            this._pocket.slots[this._pocket.nextSlotIndex].count = existingDeposit.count;
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
