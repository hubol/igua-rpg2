import { Logger } from "../../lib/game-engine/logger";
import { DataGift } from "../data/data-gift";
import { Rpg } from "../rpg/rpg";
import { DramaInventory } from "./drama-inventory";

export function* give(giftId: DataGift.Id) {
    const gift = Rpg.gift(giftId).give();
    if (!gift) {
        Logger.logContractViolationError("DramaGifts.give", new Error("Tried to give already-given gift"), { giftId });
        return;
    }
    yield* DramaInventory.receiveItems([gift.item]);
}

export const DramaGifts = {
    give,
};
