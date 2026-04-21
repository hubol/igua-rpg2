import { Logger } from "../../lib/game-engine/logger";
import { DataPotion } from "../data/data-potion";
import { RpgPotions } from "./rpg-potions";

export namespace RpgHotDogs {
    const toppingIds = ["ketchup", "mustard", "onion", "relish"] as const;

    export type ToppingId = typeof toppingIds[number];

    type Toppings = Record<ToppingId, boolean>;

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

    export function apply(potions: RpgPotions, toppingId: ToppingId) {
        let haveAnyHotDogs = false;

        for (const potionId of potionIds) {
            if (potions.count(potionId) >= 1) {
                haveAnyHotDogs = true;
                const toppings = toToppings(potionId);
                toppings[toppingId] = true;
                const convertedPotionId = toPotionId(toppings);
                if (convertedPotionId !== potionId) {
                    return { isSuccess: true as const, removePotionId: potionId, receivePotionId: convertedPotionId };
                }
            }
        }

        return { isSuccess: false as const, haveAnyHotDogs };
    }

    function toToppings(id: DataPotion.Id): Toppings {
        return {
            ketchup: id.includes("Ketchup"),
            mustard: id.includes("Mustard"),
            onion: id.includes("Onion"),
            relish: id.includes("Relish"),
        };
    }

    function toPotionId(toppings: Toppings): DataPotion.Id {
        const id = "HotDog"
            + (toppings.ketchup ? "Ketchup" : "")
            + (toppings.mustard ? "Mustard" : "")
            + (toppings.onion ? "Onion" : "")
            + (toppings.relish ? "Relish" : "");

        if (!potionIds.has(id as any)) {
            Logger.logAssertError("RpgHotDogs", new Error("Failed to convert toppings to potion"), { toppings });
            return "HotDog";
        }

        return id as DataPotion.Id;
    }
}
