import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { range } from "../../lib/range";
import { DataPotion } from "../data/data-potion";
import { playerObj } from "../objects/obj-player";

const Consts = {
    Size: 12,
};

export class RpgPotions {
    private _listSize = 0;
    private readonly _list: Array<DataPotion.Id | null> = range(Consts.Size).map(() => null);
    private readonly _excessList: Array<DataPotion.Id | null> = [];

    constructor(private readonly _state: RpgPotions.State) {
        this._updateLists();
    }

    private _updateLists() {
        this._listSize = 0;
        for (let i = 0; i < Consts.Size; i++) {
            this._list[i] = this._state[i]?.id ?? null;
            if (this._list[i]) {
                this._listSize++;
            }
        }

        this._excessList.length = 0;
        for (let i = Consts.Size; i < this._state.length; i++) {
            if (this._state[i]) {
                this._excessList.push(this._state[i]?.id ?? null);
            }
        }
    }

    get freeSlots() {
        return Math.max(0, Consts.Size - this._listSize);
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
            if (this._state[i]?.id === potionId) {
                count++;
            }
        }

        return count;
    }

    receive(potion: RpgPotion.State): void;
    receive(potionId: DataPotion.Id): void;
    receive(potionOrId: DataPotion.Id | RpgPotion.State) {
        const freeIndex = this._state.findIndex(value => value === null);
        const potion: RpgPotion.State = typeof potionOrId === "string"
            ? { id: potionOrId, containsMetal: Rng.float(100) < 1 }
            : potionOrId;
        if (freeIndex === -1) {
            this._state.push(potion);
        }
        else {
            this._state[freeIndex] = potion;
        }
        this._updateLists();
    }

    private _removeIndex(index: Integer) {
        if (index >= Consts.Size) {
            this._state.splice(index, 1);
            return;
        }

        const deleted = this._state.splice(Consts.Size, 1);
        this._state[index] = deleted[0] ?? null;
    }

    remove(potionId: DataPotion.Id, count: Integer) {
        let removedCount = 0;

        for (let i = 0; i < this._state.length;) {
            if (this._state[i]?.id === potionId) {
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

    removeAll(): Array<RpgPotion.State> {
        const result = new Array<RpgPotion.State>();

        for (let i = this._state.length - 1; i >= 0; i--) {
            const potion = this._state[i];
            this._removeIndex(i);
            if (potion) {
                result.push(potion);
            }
        }

        return result.reverse();
    }

    use(index: Integer) {
        if (!(index in this._list)) {
            Logger.logContractViolationError("RpgPotions", new Error("use() received out-of-bounds index"), {
                index,
            });
            return;
        }

        const potion = this._state[index];

        if (!potion) {
            return;
        }

        // TODO ehhhh feels bad to have the game object here...
        // I think it could easily be passed in to RpgPotions.use :-)
        DataPotion.usePotion(potion.id, playerObj);

        this._removeIndex(index);
        this._updateLists();
    }

    static createState(): RpgPotions.State {
        return range(Consts.Size).map(() => null);
    }
}

export namespace RpgPotions {
    export type State = Array<RpgPotion.State | null>;
}

export namespace RpgPotion {
    export interface State {
        id: DataPotion.Id;
        containsMetal: boolean;
    }
}
