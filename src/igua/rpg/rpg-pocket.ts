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
    };

    export type ReceiveResult = ReturnType<typeof Methods["receive"]>;
}
