import { range } from "../../lib/range";
import { DataItem } from "../data/data-item";
import { DataQuestReward } from "../data/data-quest-reward";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { RpgQuest } from "../rpg/rpg-quests";
import { DramaInventory } from "./drama-inventory";
import { DramaWallet } from "./drama-wallet";

function getQuest(maybeQuest: getQuest.Maybe) {
    return typeof maybeQuest === "string" ? Rpg.quest(maybeQuest) : maybeQuest;
}

namespace getQuest {
    export type Maybe = DataQuestReward.Id | RpgQuest;
}

function peekCompletionRewardName(maybeQuest: getQuest.Maybe) {
    const reward = getQuest(maybeQuest).peekCompletionReward();

    if (reward === null) {
        return "nothing";
    }

    if (reward.kind === "currency") {
        return reward.count === 1 ? "1 valuable" : `${reward.count} valuables`;
    }

    const itemName = DataItem.getName(reward);

    return reward.count > 1 ? `${itemName} x${reward.count}` : itemName;
}

function* complete(maybeQuest: getQuest.Maybe) {
    const reward = getQuest(maybeQuest).complete();

    if (!reward) {
        return null;
    }

    const { count, ...pull } = reward;

    if (pull.kind === "currency") {
        yield* DramaWallet.rewardValuables(count);
        return reward;
    }

    const items: Array<RpgInventory.Item> = range(count).map(() => pull);

    yield* DramaInventory.receiveItems(items);
    return reward;
}

export const DramaQuests = {
    peekCompletionRewardName,
    complete,
};
