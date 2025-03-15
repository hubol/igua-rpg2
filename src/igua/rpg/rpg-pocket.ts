import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { DataPocketItemInternalName } from "../data/data-pocket-items";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export namespace RpgPocket {
    export type Item = DataPocketItemInternalName;

    export interface Slot {
        item: Item | null;
        count: number;
    }

    export interface Model {
        nextSlotIndex: number;
        slots: Slot[];
    }

    export function create(): Model {
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

    export const Methods = {
        empty(model: Model): Integer {
            let itemsRemovedCount = 0;

            for (const slot of model.slots) {
                if (slot.item !== null) {
                    itemsRemovedCount += slot.count;
                    slot.item = null;
                }

                slot.count = 0;
            }

            return itemsRemovedCount;
        },
        receive(model: Model, item: Item) {
            // TODO assert model, item are valid

            const index = model.nextSlotIndex;
            const slot = model.slots[index];
            const reset = slot.item !== null && slot.item !== item;

            if (slot.item === null || reset) {
                slot.item = item;
                slot.count = 1;
            }
            else {
                slot.count += 1;
            }

            model.nextSlotIndex = (index + 1) % model.slots.length;

            const result = {
                index,
                reset,
                count: slot.count,
            };

            RpgExperienceRewarder.pocket.onReceive(result);

            return result;
        },
        has(model: Model, item: Item, count: number) {
            for (const slot of model.slots) {
                if (slot.item === item) {
                    count -= slot.count;
                }
            }

            return count <= 0;
        },
        count(model: Model, item: Item) {
            let count = 0;
            for (const slot of model.slots) {
                if (slot.item === item) {
                    count += slot.count;
                }
            }

            return count;
        },
        countTotal(model: Model): Integer {
            let totalItemsCount = 0;

            for (const slot of model.slots) {
                if (slot.item !== null) {
                    totalItemsCount += slot.count;
                }
            }

            return totalItemsCount;
        },
        remove(model: Model, item: Item, count: number) {
            for (const slot of model.slots) {
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
                        { model, item, count },
                    );
                }
                else if (count === 0) {
                    return;
                }
            }
        },
    };

    export type ReceiveResult = ReturnType<typeof Methods["receive"]>;
}
