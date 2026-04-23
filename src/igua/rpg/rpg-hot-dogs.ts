import { Logger } from "../../lib/game-engine/logger";
import { DataPotion } from "../data/data-potion";
import { RpgPotions } from "./rpg-potions";

export namespace RpgHotDogs {
    const condimentIds = ["ketchup", "mustard", "onion", "relish"] as const;

    export type CondimentId = typeof condimentIds[number];

    type Condiments = Record<CondimentId, boolean>;

    const potionIds = new Set(
        [
            "HotDog",
            "HotDogKetchup",
            "HotDogKetchupMustard",
            "HotDogKetchupMustardOnion",
            "HotDogKetchupMustardOnionRelish",
            "HotDogKetchupMustardRelish",
            "HotDogKetchupOnion",
            "HotDogKetchupOnionRelish",
            "HotDogKetchupRelish",
            "HotDogMustard",
            "HotDogMustardOnion",
            "HotDogMustardOnionRelish",
            "HotDogMustardRelish",
            "HotDogOnion",
            "HotDogOnionRelish",
            "HotDogRelish",
        ] satisfies Array<DataPotion.Id>,
    );

    export function apply(potions: RpgPotions, condimentId: CondimentId) {
        let haveAnyHotDogs = false;

        for (const potionId of potionIds) {
            if (potions.count(potionId) >= 1) {
                haveAnyHotDogs = true;
                const condiments = toCondiments(potionId);
                condiments[condimentId] = true;
                const convertedPotionId = toPotionId(condiments);
                if (convertedPotionId !== potionId) {
                    return { isSuccess: true as const, removePotionId: potionId, receivePotionId: convertedPotionId };
                }
            }
        }

        return { isSuccess: false as const, haveAnyHotDogs };
    }

    function toCondiments(id: DataPotion.Id): Condiments {
        return {
            ketchup: id.includes("Ketchup"),
            mustard: id.includes("Mustard"),
            onion: id.includes("Onion"),
            relish: id.includes("Relish"),
        };
    }

    function toPotionId(condiments: Condiments): DataPotion.Id {
        const id = "HotDog"
            + (condiments.ketchup ? "Ketchup" : "")
            + (condiments.mustard ? "Mustard" : "")
            + (condiments.onion ? "Onion" : "")
            + (condiments.relish ? "Relish" : "");

        if (!potionIds.has(id as any)) {
            Logger.logAssertError("RpgHotDogs", new Error("Failed to convert condiments to potion"), { condiments });
            return "HotDog";
        }

        return id as DataPotion.Id;
    }
}
