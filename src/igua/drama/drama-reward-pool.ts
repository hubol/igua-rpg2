import { range } from "../../lib/range";
import { DataRewardPool } from "../data/data-reward-pool";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DramaInventory } from "./drama-inventory";
import { DramaWallet } from "./drama-wallet";

function* reward(rewardPoolId: DataRewardPool.Id) {
    const { count, ...pull } = Rpg.rewardPool(rewardPoolId).pull();

    if (pull.kind === "currency") {
        yield* DramaWallet.rewardValuables(count);
        return;
    }

    const items: Array<RpgInventory.Item> = range(count).map(() => pull);

    yield* DramaInventory.receiveItems(items);
}

export const DramaRewardPool = {
    reward,
};
