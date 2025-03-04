import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { Empty } from "../../lib/types/empty";
import { RpgPocket } from "./rpg-pocket";
import { RpgStatus } from "./rpg-status";

export namespace RpgLoot {
    interface TierOptionDrop_Valuables {
        kind: "valuables";
        min: Integer;
        max: Integer;
        deltaPride: Integer;
    }

    interface TierOptionDrop_PocketItem {
        kind: "pocket_item";
        item: RpgPocket.Item;
    }

    // TODO key item, too

    type TierOptionDrop = TierOptionDrop_Valuables | TierOptionDrop_PocketItem | null;

    type TierOption = {
        drop: TierOptionDrop;
        weight?: Integer;
    };

    export type Model = {
        // Structure allows for implicit quirks on each tier
        // For example, perhaps a certain tier will only
        // be unlocked when the player has a certain ring equipped or something
        tier0?: TierOption[];
        tier1?: TierOption[];
    };

    export interface Drop {
        valuables: Integer;
        pocketItems: RpgPocket.Item[];
    }

    export const Methods = {
        drop(model: Model, dropperStatus: RpgStatus.Model): Drop {
            let valuables = 0;
            const pocketItems: RpgPocket.Item[] = [];

            const tiers = [model.tier0, model.tier1];

            for (const tier of tiers) {
                if (!tier) {
                    continue;
                }

                const drop = pickOptionDrop(tier);
                if (drop === null) {
                    continue;
                }

                if (drop.kind === "valuables") {
                    valuables += computeValuables(drop, dropperStatus);
                }
                else if (drop.kind === "pocket_item") {
                    pocketItems.push(drop.item);
                }
            }

            console.log(pocketItems);

            return {
                valuables,
                pocketItems,
            };
        },
    };

    function pickOptionDrop(tierOptions: TierOption[]): TierOptionDrop {
        if (tierOptions.length === 0) {
            return null;
        }

        const dropWithMinimumScores = Empty<{ score: Integer; drop: TierOptionDrop }>();
        {
            let previousScore = 0;
            for (const option of tierOptions) {
                const entry = { score: previousScore + (option.weight ?? 1), drop: option.drop };
                previousScore = entry.score;
                dropWithMinimumScores.push(entry);
            }
        }

        const maxScore = dropWithMinimumScores.last.score;
        const playerScore = Rng.int(maxScore);

        console.log({ dropWithMinimumScores, maxScore, playerScore });

        for (const { drop, score } of dropWithMinimumScores) {
            if (playerScore < score) {
                return drop;
            }
        }

        Logger.logUnexpectedError(
            "RpgLoot.pickOptionDrop",
            new Error("Failed to pick an option drop from the given tierOptions."),
            tierOptions,
        );
        return null;
    }

    function computeValuables(valuables: TierOptionDrop_Valuables, dropperStatus: RpgStatus.Model): Integer {
        if (valuables.deltaPride === 0) {
            return Math.max(valuables.max, valuables.min);
        }

        const delta = valuables.deltaPride * dropperStatus.pride;

        return valuables.deltaPride < 0
            ? Math.max(valuables.min, valuables.max + delta)
            : Math.min(valuables.max, valuables.min + delta);
    }
}
