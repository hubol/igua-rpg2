import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { CacheMap } from "../../lib/object/cache-map";
import { DataPocketItem } from "../data/data-pocket-item";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";
import { RpgPocket } from "./rpg-pocket";

const empty: RpgStashPocket.CheckBalance.Empty = { kind: "empty", count: 0 };
const notEmpty: RpgStashPocket.CheckBalance.NotEmpty = { kind: "not_empty", pocketItemId: "__Fallback__", count: 0 };

export class RpgStashPockets {
    private readonly _cacheMap = new CacheMap((stashPocketId: Integer) =>
        new RpgStashPocket(this._state, this._pocket, this._reward, stashPocketId)
    );

    constructor(
        private readonly _state: RpgStashPockets.State,
        private readonly _pocket: RpgPocket,
        private readonly _reward: RpgExperienceRewarder,
    ) {
    }

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

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
        private readonly _reward: RpgExperienceRewarder,
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

        if (balance.kind === "empty") {
            return this._pocket.isEmpty ? [] : ["deposit"];
        }

        if (this._pocket.has(balance.pocketItemId, 1)) {
            return ["deposit", "withdraw"];
        }

        if (this._pocket.findSlotThatCanReceive(balance.pocketItemId)) {
            return ["withdraw"];
        }

        return ["swap"];
    }

    checkPossibleDeposits(): DataPocketItem.Id[] {
        const balance = this.check();

        if (balance.kind === "empty") {
            return [
                ...new Set(
                    this._pocket.slots
                        .filter(slot => !slot.isEmpty)
                        .map(slot => slot.item!),
                ),
            ];
        }

        return [balance.pocketItemId];
    }

    deposit(itemId: DataPocketItem.Id) {
        if (!this.checkPossibleDeposits().includes(itemId)) {
            Logger.logAssertError("RpgStashPocket", new Error("Attempting to deposit unexpected item"), { itemId });
            return;
        }

        const balance = this.check();
        const count = this._pocket.removeAll(itemId);

        this._state.balances[this._id] = {
            pocketItemId: itemId,
            count: count + balance.count,
        };
    }

    discover() {
        if (!this._state.discoveredIds.has(this._id)) {
            this._reward.pocket.onDiscoverStash();
            this._state.discoveredIds.add(this._id);
        }
    }

    withdraw() {
        const balance = this.check();

        if (balance.kind === "empty") {
            Logger.logAssertError("RpgStashPocket", new Error("Attempting to withdraw an empty balance"));
            return;
        }

        const pocketSlot = this._pocket.findSlotThatCanReceive(balance.pocketItemId);

        if (!pocketSlot) {
            Logger.logAssertError(
                "RpgStashPocket",
                new Error("Attempting to withdraw when no available slot can receive"),
            );
            return;
        }

        delete this._state.balances[this._id];
        pocketSlot.receiveCount(balance.pocketItemId, balance.count);
    }

    swap() {
        const balance = this.check();
        // TODO maybe an index can be passed to swap?
        const slot = this._pocket.slots[0];

        if (slot.isEmpty) {
            delete this._state.balances[this._id];
        }
        else {
            const { count, item } = slot.empty();
            this._state.balances[this._id] = { count, pocketItemId: item! };
        }

        if (balance.kind === "not_empty") {
            slot.receiveCount(balance.pocketItemId, balance.count);
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
