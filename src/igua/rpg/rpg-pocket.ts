export namespace RpgPocket {
    export enum Item {
        BallFruitTypeA = "BallFruitTypeA",
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

            const slot = model.slots[model.nextSlotIndex];
            if (slot.item === null || slot.item !== item) {
                slot.item = item;
                slot.count = 1;
            }
            else {
                slot.count += 1;
            }

            model.nextSlotIndex = (model.nextSlotIndex + 1) % model.slots.length;

            // TODO return result for consumer?
        },
    };
}
