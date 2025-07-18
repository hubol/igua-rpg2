import { Integer } from "../../lib/math/number-alias-types";
import { DataQuest } from "../data/data-quest";
import { Rpg } from "./rpg";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export namespace RpgQuests {
    export type Model = Partial<Record<DataQuest.Id, Integer>>;

    export const Methods = {
        complete(questId: DataQuest.Id): DataQuest.Rewards {
            const completionsCount = (Rpg.character.quests[questId] ?? 0) + 1;
            Rpg.character.quests[questId] = completionsCount;
            const quest = DataQuest.getById(questId);
            RpgExperienceRewarder.quest.onComplete(quest.complexity, completionsCount);
            return quest.rewards;
        },
        // TODO if these are useful...
        // getCompletionCount(name: Name): Integer {
        //     return RpgProgress.character.quests[name] ?? 0;
        // },
        // isCompleted(name: Name): boolean {
        //     return Boolean(RpgProgress.character.quests[name]);
        // },
    };
}
