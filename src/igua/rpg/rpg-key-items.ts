import { Logger } from "../../lib/game-engine/logger";
import { DataKeyItem } from "../data/data-key-item";

export class RpgKeyItems {
    constructor(private readonly _state: RpgKeyItems.State) {
    }

    static createState(): RpgKeyItems.State {
        return [];
    }

    receive(item: RpgKeyItems.Item) {
        this._state.push(item);
    }

    count(item: RpgKeyItems.Item) {
        let count = 0;
        for (const heldItem of this._state) {
            if (heldItem === item) {
                count++;
            }
        }

        return count;
    }

    has(item: RpgKeyItems.Item, count: number) {
        for (const heldItem of this._state) {
            if (heldItem === item) {
                count--;
            }
        }

        return count <= 0;
    }

    remove(item: RpgKeyItems.Item, count: number) {
        let index = 0;
        while (index < this._state.length) {
            const modelItem = this._state[index];
            if (modelItem === item) {
                count--;
                this._state.splice(index, 1);
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
                { state: this._state, item, count },
            );
        }
    }
}

export module RpgKeyItems {
    export type Item = DataKeyItem.Id;
    export type State = Item[];
}
