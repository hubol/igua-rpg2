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

    peekCompletionReward(): RpgQuest.Reward {
        if (this._data.kind === "nothing") {
            return null;
        }

        if (this._data.kind === "single") {
            const { count = 1, ...reward } = this._data.reward;
            return this._state.timesCompleted === 0 ? { count, ...reward, isExtended: false } : null;
        }

        if (this._data.kind === "repeat") {
            const { count = 1, ...reward } = this._data.reward;
            // TODO not sure semantics of isExtended for repeat rewards
            return { count, ...reward, isExtended: false };
        }

        let rewards = this._data.rewards[this._state.timesCompleted] ?? null;
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

    complete(): RpgQuest.Reward {
        const reward = this.peekCompletionReward();
        this._state.timesCompleted += 1;
        this._reward.quest.onComplete(this._state.timesCompleted, reward?.isExtended ?? false);

        return reward;
    }

    get timesCompleted() {
        return this._state.timesCompleted;
    }

    get everCompleted() {
        return Boolean(this.timesCompleted);
    }

    static createState(): RpgQuest.State {
        return {
            timesCompleted: 0,
        };
    }
}

export namespace RpgQuest {
    export interface State {
        timesCompleted: Integer;
    }

    export type Reward = (Required<DataQuestReward.Reward> & { isExtended: boolean }) | null;
}
