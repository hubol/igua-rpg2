import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { Empty } from "../../lib/types/empty";
import { DataEquipment } from "../data/data-equipment";
import { DataKeyItem } from "../data/data-key-item";
import { DataPotion } from "../data/data-potion";
import { RpgExperience } from "./rpg-experience";
import { RpgPlayerBuffs } from "./rpg-player-buffs";
import { RpgPocket } from "./rpg-pocket";
import { RpgStatus } from "./rpg-status";

export class RpgLoot {
    constructor(private readonly _experience: RpgExperience) {
    }

    drop(table: RpgLoot.Table, dropperStatus: RpgStatus.Model, lootBuffs: RpgPlayerBuffs.Model["loot"]): RpgLoot.Drop {
        const equipments: DataEquipment.Id[] = [];
        const keyItems: DataKeyItem.Id[] = [];
        let valuables = lootBuffs.valuables.bonus;
        const pocketItems: RpgPocket.Item[] = [];
        const flops: Integer[] = [];
        const potions: DataPotion.Id[] = [];

        const tiers = [table.tier0, table.tier1];
        const rerollCounts: Integer[] = [];

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

            rerollCounts.push(rerollCount);

            if (drop === null) {
                continue;
            }

            const count = drop.count ?? 1;

            for (let i = 0; i < count; i++) {
                if (drop.kind === "equipment") {
                    equipments.push(drop.id);
                }
                else if (drop.kind === "key_item") {
                    keyItems.push(drop.id);
                }
                else if (drop.kind === "valuables") {
                    valuables += computeValuables(drop, dropperStatus);
                }
                else if (drop.kind === "pocket_item") {
                    pocketItems.push(drop.id);
                    if (Rng.float(100) <= lootBuffs.pocket.bonusChance) {
                        pocketItems.push(drop.id);
                    }
                }
                else if (drop.kind === "flop") {
                    flops.push(Rng.intc(drop.min, drop.max));
                }
                else if (drop.kind === "potion") {
                    potions.push(drop.id);
                }
            }
        }

        this._experience.reward.gambling.onRerollLoot(rerollCounts);

        const rerolledTimes = rerollCounts.reduce((sum, count) => sum + count, 0);

        return {
            equipments,
            keyItems,
            valuables,
            pocketItems,
            flops,
            potions,
            rerolledTimes,
        };
    }
}

function pickOptionDrop(
    tierOptions: RpgLoot.Table.TierOption[],
): Exclude<RpgLoot.Table.TierOption, RpgLoot.Table.TierOption.Drop.Nothing> | null {
    if (tierOptions.length === 0) {
        return null;
    }

    const dropWithMinimumScores = Empty<{ score: Integer; drop: RpgLoot.Table.TierOption }>();
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
            return drop.kind === "nothing" ? null : drop;
        }
    }

    Logger.logUnexpectedError(
        "RpgLoot.pickOptionDrop",
        new Error("Failed to pick an option drop from the given tierOptions."),
        tierOptions,
    );
    return null;
}

function computeValuables(valuables: RpgLoot.Table.TierOption.Drop.Valuables, dropperStatus: RpgStatus.Model): Integer {
    if (valuables.deltaPride === 0) {
        return Math.max(valuables.max, valuables.min);
    }

    const delta = valuables.deltaPride * dropperStatus.pride;

    return valuables.deltaPride < 0
        ? Math.max(valuables.min, valuables.max + delta)
        : Math.min(valuables.max, valuables.min + delta);
}

export namespace RpgLoot {
    export interface Drop {
        equipments: DataEquipment.Id[];
        keyItems: DataKeyItem.Id[];
        valuables: Integer;
        pocketItems: RpgPocket.Item[];
        potions: DataPotion.Id[];
        flops: Integer[];
        rerolledTimes: Integer;
    }

    export type Table = {
        // Structure allows for implicit quirks on each tier
        // For example, perhaps a certain tier will only
        // be unlocked when the player has a certain ring equipped or something
        tier0?: Table.TierOption[];
        tier1?: Table.TierOption[];
    };

    export namespace Table {
        export type TierOption = TierOption.Drop & {
            count?: Integer;
            weight?: Integer;
        };

        export namespace TierOption {
            export type Drop =
                | Drop.Equipment
                | Drop.Flop
                | Drop.KeyItem
                | Drop.Nothing
                | Drop.PocketItem
                | Drop.Potion
                | Drop.Valuables;

            export namespace Drop {
                export interface Valuables {
                    kind: "valuables";
                    min: Integer;
                    max: Integer;
                    deltaPride: Integer;
                }

                export interface PocketItem {
                    kind: "pocket_item";
                    id: RpgPocket.Item;
                }

                export interface Equipment {
                    kind: "equipment";
                    id: DataEquipment.Id;
                }

                export interface KeyItem {
                    kind: "key_item";
                    id: DataKeyItem.Id;
                }

                export interface Potion {
                    kind: "potion";
                    id: DataPotion.Id;
                }

                export interface Flop {
                    kind: "flop";
                    min: Integer;
                    max: Integer;
                }

                export interface Nothing {
                    kind: "nothing";
                }
            }
        }
    }
}
