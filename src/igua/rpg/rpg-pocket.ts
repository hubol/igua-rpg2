import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { DataPocketItem } from "../data/data-pocket-item";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export class RpgPocket {
    constructor(private readonly _state: RpgPocket.State) {
    }

    get slots(): ReadonlyArray<Readonly<RpgPocket.Slot>> {
        return this._state.slots;
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

        RpgExperienceRewarder.pocket.onRemoveItems(totalItems);

        return {
            items,
            totalItems,
        };
    }

    receive(item: RpgPocket.Item) {
        // TODO assert model, item are valid

        const index = this._state.nextSlotIndex;
        const slot = this._state.slots[index];
        const reset = slot.item !== null && slot.item !== item;

        if (slot.item === null || reset) {
            slot.item = item;
            slot.count = 1;
        }
        else {
            slot.count += 1;
        }

        this._state.nextSlotIndex = (index + 1) % this._state.slots.length;

        const result = {
            index,
            reset,
            count: slot.count,
        };

        RpgExperienceRewarder.pocket.onReceive(result);

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
                // TODO feels a little crude to have an effect here
                RpgExperienceRewarder.pocket.onRemoveItems(countToTakeFromSlot);
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
            nextSlotIndex: 0,
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

    export interface Slot {
        item: Item | null;
        count: number;
    }

    export interface State {
        nextSlotIndex: number;
        slots: Slot[];
    }

    export type EmptyResult = ReturnType<RpgPocket["empty"]>;
    export type ReceiveResult = ReturnType<RpgPocket["receive"]>;
}
