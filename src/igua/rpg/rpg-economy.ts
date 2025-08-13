import { Integer } from "../../lib/math/number-alias-types";
import { RpgExperience } from "./rpg-experience";

export namespace RpgEconomy {
    export namespace Currency {
        export type Id = "valuables" | "mechanical_idol_credits" | RpgExperience.Id;
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
}
