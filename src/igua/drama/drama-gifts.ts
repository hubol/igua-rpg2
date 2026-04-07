import { Logger } from "../../lib/game-engine/logger";
import { RpgGift } from "../rpg/rpg-gifts";
import { DramaInventory } from "./drama-inventory";

export function* give(giveable: RpgGift.Giveable) {
    const gift = giveable.give();
    if (!gift) {
        Logger.logContractViolationError("DramaGifts.give", new Error("Tried to give already-given gift"), {
            giftId: giveable.id,
        });
        return;
    }
    yield* DramaInventory.receiveItems([gift.item]);
}

export const DramaGifts = {
    give,
};
