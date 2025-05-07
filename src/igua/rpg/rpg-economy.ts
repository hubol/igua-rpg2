import { RpgProgress, RpgProgressExperience } from "./rpg-progress";

interface Currency_Experience {
    kind: "experience";
    experience: RpgProgressExperience;
}

export namespace RpgEconomy {
    export namespace Currency {
        export type Model = "valuables" | Currency_Experience;

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

        export function getPlayerHeldAmount(currency: Model) {
            if (currency === "valuables") {
                return RpgProgress.character.inventory.valuables;
            }

            const experience = currency.experience;
            return RpgProgress.character.experience[experience];
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
}
