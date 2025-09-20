import { DataQuest } from "../data/data-quest";
import { Rpg } from "../rpg/rpg";
import { DramaWallet } from "./drama-wallet";

function* completeQuest(questId: DataQuest.Id) {
    const rewards = Rpg.quest(questId).complete();
    if (rewards.valuables) {
        yield* DramaWallet.rewardValuables(rewards.valuables);
    }
}

export const DramaQuests = {
    completeQuest,
};
