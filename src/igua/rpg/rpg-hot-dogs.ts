import { Logger } from "../../lib/game-engine/logger";
import { DataPotion } from "../data/data-potion";
import { RpgPotions } from "./rpg-potions";

export namespace RpgHotDogs {
    const condimentIds = ["ketchup", "mustard", "onion", "relish"] as const;

    export type CondimentId = typeof condimentIds[number];

    type Condiments = Set<DataPotion.Flag>;

    const potionIds = new Set(
        DataPotion
            .filter(potion => potion.flags.has("is_hot_dog"))
            .map(potion => potion.id),
    );

    const condimentFlags: Record<CondimentId, DataPotion.Flag> = {
        ketchup: "has_ketchup",
        mustard: "has_mustard",
        onion: "has_onion",
        relish: "has_relish",
    };

    export function apply(potions: RpgPotions, condimentId: CondimentId) {
        let haveAnyHotDogs = false;

        for (const potionId of potionIds) {
            if (potions.count(potionId) >= 1) {
                haveAnyHotDogs = true;
                const condiments = getCondiments(potionId, condimentId);
                const convertedPotionId = toPotionId(condiments);
                if (convertedPotionId !== potionId) {
                    return { isSuccess: true as const, removePotionId: potionId, receivePotionId: convertedPotionId };
                }
            }
        }

        return { isSuccess: false as const, haveAnyHotDogs };
    }

    function getCondiments(id: DataPotion.Id, appliedCondimentId: CondimentId): Condiments {
        const potionFlags = new Set(DataPotion.getById(id).flags);
        potionFlags.add(condimentFlags[appliedCondimentId]);
        return potionFlags;
    }

    function toPotionId(condiments: Condiments): DataPotion.Id {
        const potion = DataPotion.find(
            potion =>
                potion.flags.has("is_hot_dog")
                && potion.flags.has("has_ketchup") === condiments.has("has_ketchup")
                && potion.flags.has("has_mustard") === condiments.has("has_mustard")
                && potion.flags.has("has_onion") === condiments.has("has_onion")
                && potion.flags.has("has_relish") === condiments.has("has_relish"),
        );

        if (!potion) {
            Logger.logAssertError("RpgHotDogs", new Error("Failed to convert condiments to potion"), { condiments });
            return "HotDog";
        }

        return potion.id;
    }
}
