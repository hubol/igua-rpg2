import { Integer } from "../../lib/math/number-alias-types";
import { CacheMap } from "../../lib/object/cache-map";
import { DataQuestReward } from "../data/data-quest-reward";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export class RpgQuests {
    private readonly _cacheMap = new CacheMap((questId: DataQuestReward.Id) => {
        const questState = this._state[questId] ?? (this._state[questId] = RpgQuest.createState());
        return new RpgQuest(questState, DataQuestReward.getById(questId), this._reward);
    });

    constructor(
        private readonly _state: RpgQuests.State,
        private readonly _reward: RpgExperienceRewarder,
    ) {
    }

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

    static createState(): RpgQuests.State {
        return {};
    }
}

namespace RpgQuests {
    export type State = Partial<Record<DataQuestReward.Id, RpgQuest.State>>;
}

export class RpgQuest {
    constructor(
        private readonly _state: RpgQuest.State,
        private readonly _data: DataQuestReward.Model,
        private readonly _reward: RpgExperienceRewarder,
    ) {
    }

    peekReward(): RpgQuest.Reward {
        if (this._data.kind === "single") {
            const { count = 1, ...reward } = this._data.reward;
            return this._state.rewardsReceived === 0 ? { count, ...reward, isExtended: false } : null;
        }

        let rewards = this._data.rewards[this._state.rewardsReceived] ?? null;
        let isExtended = false;

        if (!rewards && this._data.extend) {
            rewards = this._data.extend.reward;
            isExtended = true;
        }

        if (!rewards) {
            return null;
        }

        return {
            ...rewards,
            count: rewards.count ?? 1,
            isExtended,
        };
    }

    receiveReward(): RpgQuest.Reward {
        const reward = this.peekReward();
        if (reward) {
            this._state.rewardsReceived += 1;
            this._reward.quest.onReceiveReward(this._state.rewardsReceived, reward.isExtended);
        }

        return reward;
    }

    static createState(): RpgQuest.State {
        return {
            rewardsReceived: 0,
        };
    }
}

export namespace RpgQuest {
    export interface State {
        rewardsReceived: Integer;
    }

    export type Reward = (Required<DataQuestReward.Reward> & { isExtended: boolean }) | null;
}
