import { DisplayObject } from "pixi.js";
import { DataQuest } from "../data/data-quest";
import { RpgQuests } from "../rpg/rpg-quests";
import { DramaWallet } from "./drama-wallet";

function* completeQuest(questId: DataQuest.Id, rewarderObj: DisplayObject) {
    const rewards = RpgQuests.Methods.complete(questId);
    if (rewards.valuables) {
        yield* DramaWallet.rewardValuables(rewards.valuables, rewarderObj);
    }
}

export const DramaQuests = {
    completeQuest,
};
