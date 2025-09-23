import { Integer } from "../../lib/math/number-alias-types";
import { CacheMap } from "../../lib/object/cache-map";
import { DataQuest } from "../data/data-quest";
import { RpgExperience } from "./rpg-experience";

export class RpgQuests {
    private readonly _cacheMap = new CacheMap((questId: DataQuest.Id) =>
        new RpgQuest(this._state, questId, this._experience)
    );

    constructor(private readonly _state: RpgQuests.State, private readonly _experience: RpgExperience) {
    }

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

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
