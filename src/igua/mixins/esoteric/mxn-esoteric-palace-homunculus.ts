import { DataHomunculus } from "../../data/data-homunculus";
import { DramaInventory } from "../../drama/drama-inventory";
import { dramaShop } from "../../drama/drama-shop";
import { DramaWallet } from "../../drama/drama-wallet";
import { ask, show } from "../../drama/show";
import { objCharacterHomunculus } from "../../objects/characters/obj-character-homunculus";
import { Rpg } from "../../rpg/rpg";
import { RpgInventory } from "../../rpg/rpg-inventory";

export function mxnEsotericPalaceHomunculus(obj: objCharacterHomunculus.Type) {
    const id = obj.objCharacterHomunculus.id;

    const rpgStaff = {
        get isReceived() {
            return Rpg.flags.homunculus.receivedStaff[id];
        },
        set isReceived(value) {
            Rpg.flags.homunculus.receivedStaff[id] = value;
        },
    };

    const data = DataHomunculus.getById(id);
    const keyItem: RpgInventory.Item.KeyItem = { kind: "key_item", id: data.staffKeyItemId };

    const api = {
        *greet(message: string, ...options: Array<string | null>) {
            const result = yield* ask(
                message,
                Rpg.inventory.has(keyItem) ? "I have your staff!" : null,
                "Trade",
                ...options,
            );
            if (result === 0) {
                // TODO different for each?
                yield* show("Splendid, give it here!");
                yield* DramaInventory.removeAll(keyItem);
                rpgStaff.isReceived = true;
                yield* show("Wonderful. I can work with my magicks again.", "Please take this.");
                yield* DramaWallet.earn("homunculus_bucks", 1);
                return null;
            }
            else if (result === 1) {
                yield* dramaShop(data.shopId, obj.speaker);
                return null;
            }

            return result - 2;
        },
    };

    return obj
        .step(self => self.objCharacterHomunculus.hasStaff = rpgStaff.isReceived)
        .merge({ mxnEsotericPalaceHomunculus: api });
}
