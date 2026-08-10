import { Integer } from "../../lib/math/number-alias-types";
import { CacheMap } from "../../lib/object/cache-map";
import { clone } from "../../lib/object/clone";
import { DataQuest } from "../data/data-quest";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export class RpgQuests {
    private readonly _cacheMap = new CacheMap((questId: DataQuest.Id) => {
        const data = DataQuest.getById(questId);
        const flags = data.flags ? clone(data.flags) : null;
        const state = this._state[questId] ?? (this._state[questId] = RpgQuest.createState(flags));
        // @ts-expect-error
        return new RpgQuest(state, data, this._reward);
    });

    constructor(
        private readonly _state: RpgQuests.State,
        private readonly _reward: RpgExperienceRewarder,
    ) {
    }

    getById<TId extends DataQuest.Id>(id: TId): RpgQuest<TId> {
        return this._cacheMap.get(id) as RpgQuest<TId>;
    }

    static createState(): RpgQuests.State {
        return {};
    }
}

namespace RpgQuests {
    export type State = Partial<Record<DataQuest.Id, RpgQuest.State<unknown>>>;
}

export class RpgQuest<TId extends DataQuest.Id | unknown = unknown> {
    constructor(
        private readonly _state: RpgQuest.State<DataQuest.Flags<TId>>,
        private readonly _data: DataQuest.Model<DataQuest.Flags<TId>>,
        private readonly _reward: RpgExperienceRewarder,
    ) {
    }

    get flags(): DataQuest.Flags<TId> {
        return this._state.flags;
    }

    peekCompletionReward(): RpgQuest.Reward {
        const reward = this._data.reward;

        if (reward.kind === "nothing") {
            return this._state.timesCompleted === 0 || reward.countCompletions === "always"
                ? { drops: [], isExtended: false }
                : null;
        }

        if (reward.kind === "single") {
            return this._state.timesCompleted === 0 || reward.countCompletions === "always"
                ? { drops: DataQuest.Reward.Drop.flatten(reward.drop), isExtended: false }
                : null;
        }

        if (reward.kind === "repeat") {
            // TODO not sure semantics of isExtended for repeat rewards
            return { drops: DataQuest.Reward.Drop.flatten(reward.drop), isExtended: false };
        }

        let drop = reward.drops[this._state.timesCompleted] ?? null;
        let isExtended = false;

        if (!drop && reward.extend) {
            drop = reward.extend.drop;
            isExtended = true;
        }

        if (!drop) {
            return null;
        }

        return {
            drops: DataQuest.Reward.Drop.flatten(drop),
            isExtended,
        };
    }

    complete(): RpgQuest.Reward {
        const reward = this.peekCompletionReward();
        // TODO Previously, there was a flag on the quest that indicated whether or not XP should always be awarded on completion
        // I think this can be safely inferred from the reward for now
        if (reward || this._state.timesCompleted === 0) {
            this._state.timesCompleted += 1;
            this._reward.quest.onComplete(this._state.timesCompleted, reward?.isExtended ?? false);
        }

        return reward;
    }

    get timesCompleted() {
        return this._state.timesCompleted;
    }

    get everCompleted() {
        return Boolean(this.timesCompleted);
    }

    get isCompletable() {
        return !this.everCompleted || this.peekCompletionReward() !== null;
    }

    static createState<TFlags>(initialFlags: TFlags): RpgQuest.State<TFlags> {
        return {
            timesCompleted: 0,
            flags: initialFlags,
        };
    }
}

export namespace RpgQuest {
    export interface State<TFlags> {
        timesCompleted: Integer;
        flags: TFlags;
    }

    export type Reward = { drops: DataQuest.Reward.Drop.Type.Flattened; isExtended: boolean } | null;
}
