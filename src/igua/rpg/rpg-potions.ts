import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { range } from "../../lib/range";
import { DataPotion } from "../data/data-potion";

const Consts = {
    Size: 12,
};

export class RpgPotions {
    private readonly _list: Array<DataPotion.Id | null> = range(Consts.Size).map(() => null);
    private readonly _excessList: Array<DataPotion.Id | null> = [];

    constructor(private readonly _state: RpgPotions.State) {
        this._updateLists();
    }

    private _updateLists() {
        for (let i = 0; i < Consts.Size; i++) {
            this._list[i] = this._state[i] ?? null;
        }

        this._excessList.length = 0;
        for (let i = Consts.Size; i < this._state.length; i++) {
            if (this._state[i]) {
                this._excessList.push(this._state[i]);
            }
        }
    }

    get list(): ReadonlyArray<DataPotion.Id | null> {
        return this._list;
    }

    get excessList(): ReadonlyArray<DataPotion.Id | null> {
        return this._excessList;
    }

    get length() {
        if (this._excessList.length) {
            return this._list.length + this._excessList.length;
        }

        let count = 0;
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i]) {
                count++;
            }
        }

        return count;
    }

    count(potionId: DataPotion.Id) {
        let count = 0;
        for (let i = 0; i < this._state.length; i++) {
            if (this._state[i] === potionId) {
                count++;
            }
        }

        return count;
    }

    receive(potionId: DataPotion.Id) {
        const freeIndex = this._state.findIndex(value => value === null);
        if (freeIndex === -1) {
            this._state.push(potionId);
        }
        else {
            this._state[freeIndex] = potionId;
        }
        this._updateLists();
    }

    private _removeIndex(index: Integer) {
        const deleted = this._state.splice(Consts.Size, 1);
        this._state[index] = deleted[0] ?? null;
    }

    remove(potionId: DataPotion.Id, count: Integer) {
        let removedCount = 0;

        for (let i = 0; i < this._state.length;) {
            if (this._state[i] === potionId) {
                this._removeIndex(i);

                if (++removedCount >= count) {
                    break;
                }
            }
            else {
                i++;
            }
        }
        this._updateLists();

        if (removedCount !== count) {
            Logger.logContractViolationError(
                "RpgPotions",
                new Error("Failed to remove() requested count of potions. Did you check with count()?"),
                { potionId, count, removedCount },
            );
        }
    }

    use(index: Integer) {
        if (!(index in this._list)) {
            Logger.logContractViolationError("RpgPotions", new Error("use() received out-of-bounds index"), {
                index,
            });
            return;
        }

        const potionId = this._state[index];

        if (!potionId) {
            return;
        }

        // TODO I think this should require an RpgPlayer to be passed
        DataPotion.usePotion(potionId);

        this._removeIndex(index);
        this._updateLists();
    }

    static createState(): RpgPotions.State {
        return range(Consts.Size).map(() => null);
    }
}

export module RpgPotions {
    export type State = Array<DataPotion.Id | null>;
}
