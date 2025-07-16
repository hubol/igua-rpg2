import { Integer } from "../../lib/math/number-alias-types";
import { DataPocketItem } from "../data/data-pocket-item";
import { RpgPocket } from "./rpg-pocket";
import { RpgProgress } from "./rpg-progress";

export namespace RpgStashPocket {
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

    function check(stashPocketId: Integer) {
        const deposit = RpgProgress.programmaticFlags.stashPocketDeposits[stashPocketId];
        if (!deposit || deposit.count < 1) {
            return empty;
        }

        notEmpty.count = deposit.count;
        notEmpty.pocketItemId = deposit.pocketItemId;
        return notEmpty;
    }

    type Operation = "withdraw" | "deposit" | "swap";

    // TODO why do you pass an id and then implicitly access global RpgProgress, but require passing pocket?
    function checkPossibleOperations(stashPocketId: Integer, model: RpgPocket.Model): Operation[] {
        const existingDeposit = check(stashPocketId);
        const currentSlot = model.slots[model.nextSlotIndex];

        if (existingDeposit.kind === "empty") {
            return currentSlot.count === 0 ? [] : ["deposit"];
        }

        if (existingDeposit.pocketItemId === currentSlot.item) {
            return ["deposit", "withdraw"];
        }

        // TODO all the count === 0 or !item checks suck
        return (currentSlot.count === 0 || !currentSlot.item) ? ["withdraw"] : ["swap"];
    }

    function deposit(stashPocketId: Integer, model: RpgPocket.Model) {
        const existingDeposit = check(stashPocketId);
        const { count, item } = model.slots[model.nextSlotIndex];

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        RpgProgress.programmaticFlags.stashPocketDeposits[stashPocketId] = {
            pocketItemId: item!,
            count: count + existingDeposit.count,
        };

        model.slots[model.nextSlotIndex].item = null;
        model.slots[model.nextSlotIndex].count = 0;
    }

    function withdraw(stashPocketId: Integer, model: RpgPocket.Model) {
        const existingDeposit = check(stashPocketId);
        const { count } = model.slots[model.nextSlotIndex];

        // TODO assert that existing deposit item and deposited item are identical, and that count > 0 and item is truthy

        if (existingDeposit.kind === "empty") {
            // TODO assert fail
            return;
        }

        delete RpgProgress.programmaticFlags.stashPocketDeposits[stashPocketId];
        model.slots[model.nextSlotIndex].item = existingDeposit.pocketItemId;
        model.slots[model.nextSlotIndex].count = count + existingDeposit.count;
    }

    function swap(stashPocketId: Integer, model: RpgPocket.Model) {
        const existingDeposit = check(stashPocketId);
        const { count, item } = model.slots[model.nextSlotIndex];

        if (count === 0 || !item) {
            delete RpgProgress.programmaticFlags.stashPocketDeposits[stashPocketId];
        }
        else {
            RpgProgress.programmaticFlags.stashPocketDeposits[stashPocketId] = { count, pocketItemId: item };
        }

        if (existingDeposit.kind === "not_empty") {
            model.slots[model.nextSlotIndex].item = existingDeposit.pocketItemId;
            model.slots[model.nextSlotIndex].count = existingDeposit.count;
        }
    }

    export const Methods = {
        check,
        checkPossibleOperations,
        deposit,
        withdraw,
        swap,
    };
}
