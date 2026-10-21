import { sleep } from "../../../lib/game-engine/routines/sleep";
import { DataHomunculus } from "../../data/data-homunculus";
import { DramaInventory } from "../../drama/drama-inventory";
import { dramaShop } from "../../drama/drama-shop";
import { DramaWallet } from "../../drama/drama-wallet";
import { ask, show } from "../../drama/show";
import { objCharacterHomunculus } from "../../objects/characters/obj-character-homunculus";
import { objFxSparkle24Px } from "../../objects/effects/obj-fx-sparkle-24px";
import { playerObj } from "../../objects/obj-player";
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
                rpgStaff.isReceived ? "Bless me!" : null,
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
                yield* show("If you need a blessing, tell me.");
                return null;
            }
            else if (result === 1) {
                yield* show("You want a blessing? Here you go.");
                objFxSparkle24Px.objFxBurst()
                    .at(playerObj)
                    .show();
                Rpg.character.temporaryEffects.clear();
                Rpg.character.temporaryEffects.add(data.temporaryEffectId, 120);
                yield sleep(1000);
                yield* show(
                    "The power of my magic will last you 2 minutes.",
                    "I thank you again for returning my staff to me.",
                );
            }
            else if (result === 2) {
                yield* dramaShop(data.shopId, obj.speaker);
                return null;
            }

            return result - 3;
        },
    };

    return obj
        .step(self => self.objCharacterHomunculus.hasStaff = rpgStaff.isReceived)
        .merge({ mxnEsotericPalaceHomunculus: api });
}
