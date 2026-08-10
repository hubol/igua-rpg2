import { range } from "../../lib/range";
import { DataItem } from "../data/data-item";
import { DataQuest } from "../data/data-quest";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { RpgQuest } from "../rpg/rpg-quests";
import { DramaInventory } from "./drama-inventory";
import { DramaWallet } from "./drama-wallet";

function getQuest(maybeQuest: getQuest.Maybe) {
    return typeof maybeQuest === "string" ? Rpg.quest(maybeQuest) : maybeQuest;
}

namespace getQuest {
    export type Maybe = DataQuest.Id | RpgQuest;
}

function peekCompletionRewardName(maybeQuest: getQuest.Maybe) {
    const reward = getQuest(maybeQuest).peekCompletionReward();

    if (reward === null) {
        return "nothing";
    }

    return reward.drops
        .map(drop => {
            const count = drop.count;

            if (drop.kind === "currency") {
                return count === 1 ? "1 valuable" : `${count} valuables`;
            }

            const itemName = DataItem.getName(drop);
            return count > 1 ? `${itemName} x${count}` : itemName;
        })
        .join(", ");
}

function* complete(maybeQuest: getQuest.Maybe) {
    const reward = getQuest(maybeQuest).complete();

    if (!reward) {
        return null;
    }

    for (const drop of reward.drops) {
        const count = drop.count;

        if (drop.kind === "currency") {
            yield* DramaWallet.rewardValuables(count);
        }
        else {
            const items: Array<RpgInventory.Item> = range(count).map(() => drop);
            yield* DramaInventory.receiveItems(items);
        }
    }

    return reward;
}

export const DramaQuests = {
    peekCompletionRewardName,
    complete,
};
