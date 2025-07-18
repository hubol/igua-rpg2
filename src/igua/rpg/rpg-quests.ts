import { Integer } from "../../lib/math/number-alias-types";
import { DataQuest } from "../data/data-quest";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export class RpgQuests {
    constructor(private readonly _state: RpgQuests.State) {
    }

    complete(questId: DataQuest.Id): DataQuest.Rewards {
        const completionsCount = (this._state[questId] ?? 0) + 1;
        this._state[questId] = completionsCount;
        const quest = DataQuest.getById(questId);
        RpgExperienceRewarder.quest.onComplete(quest.complexity, completionsCount);
        return quest.rewards;
    }

    static createState(): RpgQuests.State {
        return {};
    }
}

module RpgQuests {
    export type State = Partial<Record<DataQuest.Id, Integer>>;
}
