import { Integer } from "../../lib/math/number-alias-types";
import { CacheMap } from "../../lib/object/cache-map";
import { DataRewardPool } from "../data/data-reward-pool";

export class RpgRewardPools {
    private readonly _cacheMap = new CacheMap((rewardPoolId: DataRewardPool.Id) => {
        const rewardPoolState = this._state[rewardPoolId] ?? (this._state[rewardPoolId] = RpgRewardPool.createState());
        return new RpgRewardPool(rewardPoolState, DataRewardPool.getById(rewardPoolId));
    });

    constructor(
        private readonly _state: RpgRewardPools.State,
    ) {
    }

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

    static createState(): RpgRewardPools.State {
        return {};
    }
}

namespace RpgRewardPools {
    export type State = Partial<Record<DataRewardPool.Id, RpgRewardPool.State>>;
}

export class RpgRewardPool {
    constructor(
        private readonly _state: RpgRewardPool.State,
        private readonly _data: DataRewardPool.Model,
    ) {
    }

    peek(): RpgRewardPool.Pull {
        let pull = this._data.items[this._state.pulls] ?? null;

        if (!pull && this._data.extend) {
            pull = this._data.extend.item;
        }

        if (!pull) {
            return null;
        }

        return {
            ...pull,
            count: pull.count ?? 1,
        };
    }

    pull(): RpgRewardPool.Pull {
        const pull = this.peek();
        this._state.pulls += 1;
        return pull;
    }

    static createState(): RpgRewardPool.State {
        return {
            pulls: 0,
        };
    }
}

namespace RpgRewardPool {
    export interface State {
        pulls: Integer;
    }

    export type Pull = Required<DataRewardPool.Item> | null;
}
