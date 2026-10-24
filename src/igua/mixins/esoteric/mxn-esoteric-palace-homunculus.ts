import { sleep } from "../../../lib/game-engine/routines/sleep";
import { DataHint } from "../../data/data-hint";
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

export function mxnEsotericPalaceHomunculus(obj: objCharacterHomunculus.Type, args: mxnEsotericPalaceHomunculus.Args) {
    const id = obj.objCharacterHomunculus.id;

    const rpgStaff = {
        get isReceived() {
            return Rpg.flags.homunculus.receivedStaff[id];
        },
        set isReceived(value) {
            Rpg.flags.homunculus.receivedStaff[id] = value;
        },
    };

    const rpgToldPlayer = {
        get aboutNeeds() {
            return Rpg.flags.homunculus[args.progressKey].toldPlayerAboutNeeds;
        },
        set aboutNeeds(value) {
            Rpg.flags.homunculus[args.progressKey].toldPlayerAboutNeeds = value;
        },
    };

    const data = DataHomunculus.getById(id);
    const keyItem: RpgInventory.Item.KeyItem = { kind: "key_item", id: data.staffKeyItemId };

    const api = {
        *greet(message: string, ...options: Array<string | null>) {
            if (!rpgToldPlayer.aboutNeeds) {
                yield* show(
                    "Hello little creature!",
                    "I'm delighted to see you here.",
                    "There is a bit of a predicament.",
                    "You see, the wizard has worked so hard on this world.",
                    "And as councilmembers, we want to help the overworked wizard realize his goals.",
                    "But our abilities are limited without the proper tools.",
                    "Staves--magical staves--they are known to be in the crystal hall.",
                );

                yield sleep(1000);

                yield* show(
                    "Little creature, we will bless you and offer you nice shoes and stuff...",
                    "...If you bring us the suitable staves.",
                );

                const result = yield* ask(
                    "Do you think you can do this? For us and this blossoming world?",
                    "Yes",
                    "How could I refuse?",
                );

                rpgToldPlayer.aboutNeeds = true;
                yield* show(
                    result === 1 ? "Precisely." : "Excellent.",
                    args.kind === "hall_location"
                        ? "Please chat with me more about the crystal hall."
                        : "Please chat with my associate about the crystal hall.",
                );

                return -99;
            }

            const result = yield* ask(
                message,
                Rpg.inventory.has(keyItem) ? "I have your staff!" : null,
                rpgStaff.isReceived ? "Bless me!" : null,
                !rpgStaff.isReceived && args.kind === "hall_location"
                    ? "Where is the crystal hall?"
                    : null,
                !rpgStaff.isReceived && args.kind === "key_locations"
                    ? "Where are the magic keys?"
                    : null,
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
            else if (result === 2 && args.kind === "hall_location") {
                yield* show(
                    "First, the crystal hall is a special place where the wizard has left experiments behind magic doors.",
                    ...args.messages,
                    "You'll need to find magic keys to open the doors in the hall.",
                    "Speak with my associate to learn of the whereabouts of the magic keys.",
                );
            }
            else if (result === 3 && args.kind === "key_locations") {
                yield* show(
                    `There are ${args.hintIds.length} magic keys.`,
                    "Each can be used to open any door in the crystal hall.",
                );

                const necessaryHintIds = args.hintIds.filter(id => DataHint.isNecessary(id));
                const collectedKeysCount = args.hintIds.length - necessaryHintIds.length;

                if (collectedKeysCount > 0) {
                    yield* show(`You've already collected ${collectedKeysCount} of them.`);
                }

                for (const id of args.hintIds) {
                    yield* show(...DataHint.getById(id).messages);
                }
            }
            else if (result === 4) {
                yield* dramaShop(data.shopId, obj.speaker);
            }

            return result - 5;
        },
    };

    return obj
        .step(self => self.objCharacterHomunculus.hasStaff = rpgStaff.isReceived)
        .merge({ mxnEsotericPalaceHomunculus: api });
}

export namespace mxnEsotericPalaceHomunculus {
    export type Args = Args.Base & (Args.HallLocation | Args.KeyLocations);
    export namespace Args {
        export interface Base {
            progressKey: "indiana" | "ohio";
        }

        export interface HallLocation {
            kind: "hall_location";
            messages: string[];
        }

        export interface KeyLocations {
            kind: "key_locations";
            hintIds: DataHint.Id[];
        }
    }
}
