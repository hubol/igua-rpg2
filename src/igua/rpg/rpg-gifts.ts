import { CacheMap } from "../../lib/object/cache-map";
import { DataGift } from "../data/data-gift";

export class RpgGifts {
    private readonly _cacheMap = new CacheMap((giftId: DataGift.Id) => {
        const giftState = this._state[giftId] ?? (this._state[giftId] = RpgGift.createState());
        return new RpgGift(giftId, giftState, DataGift.getById(giftId));
    });

    constructor(
        private readonly _state: RpgGifts.State,
    ) {
    }

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

    static createState(): RpgGifts.State {
        return {};
    }
}

export namespace RpgGifts {
    export type State = Partial<Record<DataGift.Id, RpgGift.State>>;
}

export class RpgGift {
    constructor(
        readonly id: string,
        private readonly _state: RpgGift.State,
        private readonly _giftItem: DataGift.Model,
    ) {
    }

    isGiveable(): this is RpgGift.Giveable {
        return !this._state.given;
    }

    give(): DataGift.Model | null {
        if (this._state.given) {
            return null;
        }

        this._state.given = true;
        return this._giftItem;
    }

    static createState(): RpgGift.State {
        return {
            given: false,
        };
    }
}

export namespace RpgGift {
    export interface State {
        given: boolean;
    }

    export type Giveable = RpgGift & { isGiveable(): false };
}
