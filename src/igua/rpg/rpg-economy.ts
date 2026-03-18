import { Integer } from "../../lib/math/number-alias-types";
import { RpgExperience } from "./rpg-experience";

export namespace RpgEconomy {
    export namespace Currency {
        const nonExperienceIds = [
            "valuables",
            "mechanical_idol_credits",
            "casino_pity",
        ] as const;

        const nonExperienceIdsSet = new Set(nonExperienceIds);

        export type NonExperienceId = typeof nonExperienceIds[number];

        export function isNonExperienceId(id: string): id is NonExperienceId {
            return nonExperienceIdsSet.has(id as any);
        }

        export const Manifest = [
            ...nonExperienceIds,
            ...RpgExperience.Manifest,
        ] as const;

        export type Id = typeof Manifest[number];
    }

    export namespace Valuables {
        export type Kind = "green" | "orange" | "blue";

        export const Values: Record<Kind, number> = {
            green: 1,
            orange: 5,
            blue: 15,
        };

        export const DescendingTypes: Kind[] = ["blue", "orange", "green"];
    }

    export interface Offer {
        currency: Currency.Id;
        price: Integer;
    }

    export namespace Offer {
        export function getPluralizedNoun(price: Integer, currencyId: Currency.Id) {
            if (RpgExperience.isId(currencyId)) {
                return currencyId + " XP";
            }

            if (currencyId === "valuables") {
                return price === 1 ? "valuable" : "valuables";
            }

            return price === 1 ? "credit" : "credits";
        }

        export function toString(price: Integer, currencyId: Currency.Id) {
            return price + " " + getPluralizedNoun(price, currencyId);
        }
    }
}
