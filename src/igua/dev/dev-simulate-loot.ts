import { Integer } from "../../lib/math/number-alias-types";
import { DataEquipment } from "../data/data-equipment";
import { DataPocketItem } from "../data/data-pocket-item";
import { DataPotion } from "../data/data-potion";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";

export function devSimulateLoot(loot: RpgLoot.Model) {
    const { status } = RpgEnemyRank.create({});
    const buffs = RpgPlayerBuffs.create();

    const counts = {
        equipments: new Map<DataEquipment.Id, Integer>(),
        flops: new Map<Integer, Integer>(),
        pocketItems: new Map<DataPocketItem.Id, Integer>(),
        potions: new Map<DataPotion.Id, Integer>(),
        valuables: new Map<Integer, Integer>(),
    };

    const iterationsCount = 100000;

    for (let i = 0; i < iterationsCount; i++) {
        const drop = RpgLoot.Methods.drop(loot, status, buffs.loot);
        increment(counts.equipments, drop.equipments);
        increment(counts.flops, drop.flops);
        increment(counts.pocketItems, drop.pocketItems);
        increment(counts.potions, drop.potions);
        increment(counts.valuables, drop.valuables);
    }

    console.log(`====Loot simulation result (${iterationsCount} iterations)====
${print({ iterationsCount, map: counts.equipments, name: "Equipment", serializer: (item) => item })}
${print({ iterationsCount, map: counts.flops, name: "Flops", serializer: (item) => `#${item + 1}` })}
${print({ iterationsCount, map: counts.pocketItems, name: "Pocket Items", serializer: (item) => item })}
${print({ iterationsCount, map: counts.potions, name: "Potions", serializer: (item) => item })}
${print({ iterationsCount, map: counts.valuables, name: "Valuables", serializer: (item) => String(item) })}`);
}

interface PrintArgs<T> {
    iterationsCount: Integer;
    map: Map<T, Integer>;
    name: string;
    serializer: (item: T) => string;
}

function print<T>(args: PrintArgs<T>) {
    const orderedItems = [...args.map.entries()]
        .map(([item, count]) => ({ item, count }))
        .sort((a, b) => a.count - b.count);
    return `----${args.name}----
${
        orderedItems.map(({ item, count }) =>
            `${args.serializer(item)}: ${count} (${printPercentage(count, args.iterationsCount)})`
        ).join("\n")
    }`;
}

function printPercentage(numerator: Integer, denominator: Integer) {
    return `${((numerator / denominator) * 100).toFixed(3)}%`;
}

function increment(map: Map<unknown, Integer>, value: unknown) {
    if (Array.isArray(value)) {
        for (const item of value) {
            incrementImpl(map, item);
        }
        return;
    }

    incrementImpl(map, value);
}

function incrementImpl(map: Map<unknown, Integer>, value: unknown) {
    const count = (map.get(value) ?? 0) + 1;
    map.set(value, count);
}
