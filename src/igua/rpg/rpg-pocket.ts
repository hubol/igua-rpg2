import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { DataPocketItem } from "../data/data-pocket-item";
import { Rpg } from "./rpg";

type RpgPocketSlotPublic = Omit<RpgPocketSlot, "update">;

export class RpgPocket {
    private readonly _slotObjects: RpgPocketSlot[] = [];

    constructor(private readonly _state: RpgPocket.State) {
    }

    private get _slots() {
        while (this._slotObjects.length < this._state.slots.length) {
            const index = this._slotObjects.length;
            this._slotObjects[index] = new RpgPocketSlot(this._state.slots[index]);
        }

        this._slotObjects.length = this._state.slots.length;

        return this._slotObjects;
    }

    get slots(): ReadonlyArray<RpgPocketSlotPublic> {
        return this._slots;
    }

    get receivingSlot() {
        return this.slots[this._state.receivingSlotIndex];
    }

    empty() {
        let totalItems = 0;

        const items = Object.keys(DataPocketItem.Manifest).reduce((obj, key) => {
            obj[key as RpgPocket.Item] = 0;
            return obj;
        }, {} as Record<RpgPocket.Item, Integer>);

        for (const slot of this._state.slots) {
            if (slot.item !== null) {
                items[slot.item] += slot.count;
                totalItems += slot.count;
                slot.item = null;
            }

            slot.count = 0;
        }

        // TODO should not import Rpg
        Rpg.experience.reward.pocket.onRemoveItems(totalItems);

        return {
            items,
            totalItems,
        };
    }

    receive(item: RpgPocket.Item) {
        // TODO assert model, item are valid

        const index = this._state.receivingSlotIndex;
        const slot = this._state.slots[index];
        const reset = slot.item !== null && slot.item !== item;

        if (slot.item === null || reset) {
            slot.item = item;
            slot.count = 1;
        }
        else {
            slot.count += 1;
        }

        this._state.receivingSlotIndex = (index + 1) % this._state.slots.length;

        const result = {
            index,
            reset,
            count: slot.count,
        };

        // TODO should not import Rpg
        Rpg.experience.reward.pocket.onReceive(result);

        return result;
    }

    has(item: RpgPocket.Item, count: number) {
        for (const slot of this._state.slots) {
            if (slot.item === item) {
                count -= slot.count;
            }
        }

        return count <= 0;
    }

    count(item: RpgPocket.Item) {
        let count = 0;
        for (const slot of this._state.slots) {
            if (slot.item === item) {
                count += slot.count;
            }
        }

        return count;
    }

    // TODO getter?
    countTotal(): Integer {
        let totalItemsCount = 0;

        for (const slot of this._state.slots) {
            if (slot.item !== null) {
                totalItemsCount += slot.count;
            }
        }

        return totalItemsCount;
    }

    remove(item: RpgPocket.Item, count: number) {
        for (const slot of this._state.slots) {
            if (slot.item === item) {
                const countToTakeFromSlot = Math.min(count, slot.count);
                slot.count -= countToTakeFromSlot;
                if (slot.count === 0) {
                    slot.item = null;
                }
                count -= countToTakeFromSlot;
                // TODO should not import Rpg
                Rpg.experience.reward.pocket.onRemoveItems(countToTakeFromSlot);
            }
            if (count < 0) {
                Logger.logAssertError(
                    "RpgPocket.Methods.remove",
                    new Error(`count should not be < 0, got ${count}`),
                    { state: this._state, item, count },
                );
            }
            else if (count === 0) {
                return;
            }
        }
    }

    static createState(): RpgPocket.State {
        return {
            receivingSlotIndex: 0,
            slots: [
                {
                    item: null,
                    count: 0,
                },
            ],
        };
    }
}

export module RpgPocket {
    export type Item = DataPocketItem.Id;

    export interface State {
        receivingSlotIndex: number;
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

    update(item: RpgPocketSlot.State["item"], count: Integer) {
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

    force(item: RpgPocketSlot.State["item"], count: Integer, reason: "stash_pocket_operation") {
        this.update(item, count);
    }
}

module RpgPocketSlot {
    export interface State {
        item: RpgPocket.Item | null;
        count: number;
    }
}
