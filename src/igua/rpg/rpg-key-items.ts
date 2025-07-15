import { Logger } from "../../lib/game-engine/logger";
import { DataKeyItem } from "../data/data-key-item";

export namespace RpgKeyItems {
    // TODO suspicious alias
    export type Item = DataKeyItem.Id;
    export type Model = Item[];

    export function create(): Model {
        return [];
    }

    export const Methods = {
        receive(model: Model, item: Item) {
            model.push(item);
        },
        count(items: Model, item: Item) {
            let count = 0;
            for (const heldItem of items) {
                if (heldItem === item) {
                    count++;
                }
            }

            return count;
        },
        has(items: Model, item: Item, count: number) {
            for (const heldItem of items) {
                if (heldItem === item) {
                    count--;
                }
            }

            return count <= 0;
        },
        remove(model: Model, item: Item, count: number) {
            let index = 0;
            while (index < model.length) {
                const modelItem = model[index];
                if (modelItem === item) {
                    count--;
                    model.splice(index, 1);
                    if (count === 0) {
                        break;
                    }
                }
                else {
                    index++;
                }
            }

            if (count !== 0) {
                Logger.logAssertError(
                    "RpgKeyItems.Methods.remove",
                    new Error(`count should be 0, got ${count}`),
                    { model, item, count },
                );
            }
        },
    };
}
