import { DisplayObject } from "pixi.js";
import { DataQuest } from "../data/data-quest";
import { Rpg } from "../rpg/rpg";
import { DramaWallet } from "./drama-wallet";

function* completeQuest(questId: DataQuest.Id, rewarderObj: DisplayObject) {
    const rewards = Rpg.quest(questId).complete();
    if (rewards.valuables) {
        yield* DramaWallet.rewardValuables(rewards.valuables, rewarderObj);
    }
}

export const DramaQuests = {
    completeQuest,
};
