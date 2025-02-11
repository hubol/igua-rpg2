import { Logger } from "../../lib/game-engine/logger";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export namespace RpgPocket {
    // TODO feel like this belongs in the data directory
    export enum Item {
        BallFruitTypeA = "BallFruitTypeA",
        BallFruitTypeB = "BallFruitTypeB",
    }

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

            return {
                index,
                reset,
                count: slot.count,
            };
        },
        has(model: Model, item: Item, count: number) {
            for (const slot of model.slots) {
                if (slot.item === item) {
                    count -= slot.count;
                }
            }

            return count <= 0;
        },
        remove(model: Model, item: Item, count: number) {
            for (const slot of model.slots) {
                if (slot.item === item) {
                    const countToTakeFromSlot = Math.min(count, slot.count);
                    slot.count -= countToTakeFromSlot;
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
