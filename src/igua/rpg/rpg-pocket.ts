import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { DataPocketItem } from "../data/data-pocket-item";
import { RpgExperience } from "./rpg-experience";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";

export class RpgPocket {
    private readonly _slotObjects: RpgPocketSlot[] = [];

    constructor(
        private readonly _state: RpgPocket.State,
        private readonly _experience: RpgExperience,
        private readonly _buffs: RpgPlayerAggregatedBuffs,
    ) {
    }

    private get _slots() {
        const slotsCount = Math.max(1, 1 + this._buffs.getAggregatedBuffs().pocket.bonusSlotCount);

        while (this._slotObjects.length < slotsCount) {
            const index = this._slotObjects.length;
            if (!this._state.slots[index]) {
                this._state.slots[index] = RpgPocketSlot.createState();
            }
            this._slotObjects[index] = new RpgPocketSlot(this._state.slots[index]);
        }

        this._slotObjects.length = slotsCount;

        return this._slotObjects;
    }

    get slots(): ReadonlyArray<RpgPocketSlot> {
        return this._slots;
    }

    empty(reason: "default" | "death_tax" = "default") {
        let totalItems = 0;

        const items = Object.keys(DataPocketItem.Manifest).reduce((obj, key) => {
            obj[key as RpgPocket.Item] = 0;
            return obj;
        }, {} as Record<RpgPocket.Item, Integer>);

        for (const slot of this.slots) {
            const { item, count } = slot.empty();
            if (item !== null) {
                items[item] += count;
                totalItems += count;
            }
        }

        this._experience.reward.pocket.onRemoveItems(totalItems, reason);

        return {
            items,
            totalItems,
        };
    }

    receive(item: RpgPocket.Item) {
        const slot = this.findSlotThatCanReceive(item) ?? this.slots[0];
        const result = slot.receive(item);

        this._experience.reward.pocket.onReceive(result);

        return result;
    }

    has(item: RpgPocket.Item, count: number) {
        for (const slot of this._slots) {
            if (slot.item === item) {
                count -= slot.count;
            }
        }

        return count <= 0;
    }

    count(item: RpgPocket.Item) {
        let count = 0;
        for (const slot of this._slots) {
            if (slot.item === item) {
                count += slot.count;
            }
        }

        return count;
    }

    get totalItemsCount() {
        let totalItemsCount = 0;

        for (const slot of this._slots) {
            if (slot.item !== null) {
                totalItemsCount += slot.count;
            }
        }

        return totalItemsCount;
    }

    get isEmpty() {
        return this.totalItemsCount < 1;
    }

    get uniqueItems(): Set<RpgPocket.Item> {
        return new Set(
            this._slots
                .filter(slot => slot.count > 0 && slot.item)
                .map(slot => slot.item!),
        );
    }

    remove(item: RpgPocket.Item, removedCount: number) {
        for (const slot of this._slots) {
            if (slot.item === item) {
                const slotRemovedCount = Math.min(removedCount, slot.count);
                slot.remove(slotRemovedCount);
                removedCount -= slotRemovedCount;
                this._experience.reward.pocket.onRemoveItems(slotRemovedCount, "default");
            }
            if (removedCount < 0) {
                Logger.logAssertError(
                    "RpgPocket.Methods.remove",
                    new Error(`removedCount should not be < 0, got ${removedCount}`),
                    { state: this._state, item, count: removedCount },
                );
            }
            else if (removedCount === 0) {
                return;
            }
        }
    }

    removeAll(item: RpgPocket.Item) {
        const count = this.count(item);
        this.remove(item, count);
        return count;
    }

    findSlotThatCanReceive(item: RpgPocket.Item) {
        for (const slot of this.slots) {
            if (slot.isEmpty || slot.item === item) {
                return slot;
            }
        }

        return null;
    }

    static createState(): RpgPocket.State {
        return {
            slots: [RpgPocketSlot.createState()],
        };
    }
}

export namespace RpgPocket {
    export type Item = DataPocketItem.Id;

    export interface State {
        slots: RpgPocketSlot.State[];
    }

    export type EmptyResult = ReturnType<RpgPocket["empty"]>;
    export type ReceiveResult = ReturnType<RpgPocket["receive"]>;
}

class RpgPocketSlot {
    constructor(private readonly _state: RpgPocketSlot.State) {
    }

    get isEmpty() {
        return this._state.count === 0 || !this._state.item;
    }

    get count() {
        return this._state.count;
    }

    get item() {
        return this._state.item;
    }

    private _setState(item: RpgPocketSlot.State["item"], count: Integer) {
        if (!item && count !== 0) {
            Logger.logContractViolationError("RpgPocketSlot", new Error("item is falsy but count is not 0"), {
                item,
                count,
            });
            count = 0;
        }

        this._state.count = count;
        this._state.item = item;
    }

    empty(): RpgPocketSlot.EmptyResult {
        const result: RpgPocketSlot.EmptyResult = {
            count: this._state.count,
            item: this._state.item,
        };

        this._setState(null, 0);

        return result;
    }

    receive(item: RpgPocket.Item): RpgPocketSlot.ReceiveResult {
        const reset = this.item !== null && this.item !== item;

        if (this.item === null || reset) {
            this._setState(item, 1);
        }
        else {
            this._setState(item, this.count + 1);
        }

        return {
            reset,
            count: this.count,
        };
    }

    receiveCount(item: RpgPocket.Item, count: Integer) {
        for (let i = 0; i < count; i++) {
            this.receive(item);
        }
    }

    remove(removedCount: Integer) {
        const count = Math.max(0, this.count - removedCount);
        const item = count > 0 ? this.item : null;
        this._setState(item, count);
    }

    static createState(): RpgPocketSlot.State {
        return {
            count: 0,
            item: null,
        };
    }
}

namespace RpgPocketSlot {
    export interface State {
        item: RpgPocket.Item | null;
        count: number;
    }

    export type EmptyResult = State;

    export interface ReceiveResult {
        reset: boolean;
        count: number;
    }
}
