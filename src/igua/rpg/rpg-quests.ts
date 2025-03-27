import { Integer } from "../../lib/math/number-alias-types";
import { DataQuestInternalName, DataQuests } from "../data/data-quests";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";
import { RpgProgress } from "./rpg-progress";

export namespace RpgQuests {
    export type Complexity = "easy" | "normal";

    interface Rewards {
        valuables: Integer;
        // TODO more stuff!
    }

    export interface DataModel {
        complexity: Complexity;
        rewards: Rewards;
    }

    export type Name = DataQuestInternalName;

    export type Model = Partial<Record<Name, Integer>>;

    export const Methods = {
        complete(name: Name): Rewards {
            const completionsCount = (RpgProgress.character.quests[name] ?? 0) + 1;
            RpgProgress.character.quests[name] = completionsCount;
            const dataQuest = DataQuests[name];
            RpgExperienceRewarder.quest.onComplete(dataQuest.complexity, completionsCount);
            return dataQuest.rewards;
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
