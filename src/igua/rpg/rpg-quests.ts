import { Integer } from "../../lib/math/number-alias-types";
import { DataQuest } from "../data/data-quest";
import { RpgExperience } from "./rpg-experience";

export class RpgQuests {
    private readonly _cache: Partial<Record<DataQuest.Id, RpgQuest>> = {};

    constructor(private readonly _state: RpgQuests.State, private readonly _experience: RpgExperience) {
    }

    getById(questId: DataQuest.Id) {
        const cache = this._cache[questId];

        if (cache) {
            return cache;
        }

        return this._cache[questId] = new RpgQuest(this._state, questId, this._experience);
    }

    static createState(): RpgQuests.State {
        return {};
    }
}

class RpgQuest {
    constructor(
        private readonly _state: RpgQuests.State,
        private readonly _id: DataQuest.Id,
        private readonly _experience: RpgExperience,
    ) {
    }

    complete(): DataQuest.Rewards {
        const completionsCount = (this._state[this._id] ?? 0) + 1;
        this._state[this._id] = completionsCount;
        const quest = DataQuest.getById(this._id);
        this._experience.reward.quest.onComplete(quest.complexity, completionsCount);
        return quest.rewards;
    }
}

namespace RpgQuests {
    export type State = Partial<Record<DataQuest.Id, Integer>>;
}
