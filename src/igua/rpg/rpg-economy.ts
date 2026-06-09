import { Integer } from "../../lib/math/number-alias-types";
import { RpgExperience } from "./rpg-experience";

export namespace RpgEconomy {
    export namespace Currency {
        export const manifest = [
            "valuables",
            "mechanical_idol_credits",
            "casino_pity",
            ...RpgExperience.manifest,
        ] as const;

        export type Id = typeof manifest[number];

        export type NonExperienceId = Exclude<Id, RpgExperience.Id>;
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
        const nonExperienceNouns: Record<Currency.NonExperienceId, [singular: string, plural: string]> = {
            casino_pity: ["pity", "pity"],
            mechanical_idol_credits: ["credit", "credits"],
            valuables: ["valuable", "valuables"],
        };

        export function getPluralizedNoun(price: Integer, currencyId: Currency.Id) {
            if (RpgExperience.isId(currencyId)) {
                return currencyId + " XP";
            }

            const nouns = nonExperienceNouns[currencyId];
            return price === 1 ? nouns[0] : nouns[1];
        }

        export function toString(price: Integer, currencyId: Currency.Id) {
            return price + " " + getPluralizedNoun(price, currencyId);
        }
    }
}
