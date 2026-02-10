import { range } from "../../lib/range";
import { DataItem } from "../data/data-item";
import { DataQuestReward } from "../data/data-quest-reward";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DramaInventory } from "./drama-inventory";
import { DramaWallet } from "./drama-wallet";

function peekCompletionRewardName(questId: DataQuestReward.Id) {
    const reward = Rpg.quest(questId).peekCompletionReward();

    if (reward === null) {
        return "nothing";
    }

    if (reward.kind === "currency") {
        return reward.count === 1 ? "1 valuable" : `${reward.count} valuables`;
    }

    const itemName = DataItem.getName(reward);

    return reward.count > 1 ? `${itemName} x${reward.count}` : itemName;
}

function* complete(questId: DataQuestReward.Id) {
    const reward = Rpg.quest(questId).complete();

    if (!reward) {
        return false;
    }

    const { count, ...pull } = reward;

    if (pull.kind === "currency") {
        yield* DramaWallet.rewardValuables(count);
        return true;
    }

    const items: Array<RpgInventory.Item> = range(count).map(() => pull);

    yield* DramaInventory.receiveItems(items);
    return true;
}

export const DramaQuests = {
    peekCompletionRewardName,
    complete,
};
