import { Integer } from "../../lib/math/number-alias-types";
import { RpgExperience } from "./rpg-experience";

interface Currency_Experience {
    kind: "experience";
    experience: RpgExperience.Id;
}

export namespace RpgEconomy {
    export namespace Currency {
        export type Model = "valuables" | "mechanical_idol_credits" | Currency_Experience;

        export function equals(a: Model, b: Model) {
            if (a === b) {
                return true;
            }
            if (typeof a === "object" && typeof b === "object") {
                if (a.kind !== b.kind) {
                    return false;
                }

                return a.experience === b.experience;
            }
            return false;
        }
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
        currency: Currency.Model;
        price: Integer;
    }
}
