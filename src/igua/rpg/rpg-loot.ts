import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { Empty } from "../../lib/types/empty";
import { DataEquipment } from "../data/data-equipment";
import { RpgPlayerBuffs } from "./rpg-player-buffs";
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

    interface TierOptionDrop_Equipment {
        kind: "equipment";
        equipment: DataEquipment.Id;
    }

    interface TierOptionDrop_Flop {
        kind: "flop";
        min: Integer;
        max: Integer;
    }

    interface TierOptionDrop_Nothing {
        kind: "nothing";
    }

    // TODO key item, too

    type TierOptionDrop =
        | TierOptionDrop_Equipment
        | TierOptionDrop_Valuables
        | TierOptionDrop_PocketItem
        | TierOptionDrop_Flop
        | TierOptionDrop_Nothing;

    type TierOption = TierOptionDrop & {
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
        equipments: DataEquipment.Id[];
        valuables: Integer;
        pocketItems: RpgPocket.Item[];
        flops: Integer[];
    }

    export const Methods = {
        drop(model: Model, dropperStatus: RpgStatus.Model, lootBuffs: RpgPlayerBuffs.Model["loot"]): Drop {
            const equipments: DataEquipment.Id[] = [];
            let valuables = lootBuffs.valuables.bonus;
            const pocketItems: RpgPocket.Item[] = [];
            const flops: Integer[] = [];

            const tiers = [model.tier0, model.tier1];

            for (const tier of tiers) {
                if (!tier) {
                    continue;
                }

                let drop = pickOptionDrop(tier);

                let rerollCount = 0;
                while (drop === null && rerollCount < lootBuffs.tiers.nothingRerollCount) {
                    drop = pickOptionDrop(tier);
                    rerollCount++;
                }

                if (drop === null) {
                    continue;
                }

                if (drop.kind === "equipment") {
                    equipments.push(drop.equipment);
                }
                else if (drop.kind === "valuables") {
                    valuables += computeValuables(drop, dropperStatus);
                }
                else if (drop.kind === "pocket_item") {
                    pocketItems.push(drop.item);
                    if (Rng.float(100) <= lootBuffs.pocket.bonusChance) {
                        pocketItems.push(drop.item);
                    }
                }
                else if (drop.kind === "flop") {
                    flops.push(Rng.intc(drop.min, drop.max));
                }
            }

            return {
                equipments,
                valuables,
                pocketItems,
                flops,
            };
        },
    };

    function pickOptionDrop(tierOptions: TierOption[]): TierOptionDrop | null {
        if (tierOptions.length === 0) {
            return null;
        }

        const dropWithMinimumScores = Empty<{ score: Integer; drop: TierOptionDrop }>();
        {
            let previousScore = 0;
            for (const option of tierOptions) {
                const entry = { score: previousScore + (option.weight ?? 1), drop: option };
                previousScore = entry.score;
                dropWithMinimumScores.push(entry);
            }
        }

        const maxScore = dropWithMinimumScores.last.score;
        const playerScore = Rng.int(maxScore);

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
