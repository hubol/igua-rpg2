import { DisplayObject } from "pixi.js";
import { RpgQuests } from "../rpg/rpg-quests";
import { DramaWallet } from "./drama-wallet";

function* completeQuest(name: RpgQuests.Name, rewarderObj: DisplayObject) {
    const rewards = RpgQuests.Methods.complete(name);
    if (rewards.valuables) {
        yield* DramaWallet.rewardValuables(rewards.valuables, rewarderObj);
    }
}

export const DramaQuests = {
    completeQuest,
};
