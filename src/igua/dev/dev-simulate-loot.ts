import { Integer } from "../../lib/math/number-alias-types";
import { DataEquipment } from "../data/data-equipment";
import { DataKeyItem } from "../data/data-key-item";
import { DataPocketItem } from "../data/data-pocket-item";
import { DataPotion } from "../data/data-potion";
import { RpgCharacterEquipment } from "../rpg/rpg-character-equipment";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgExperience } from "../rpg/rpg-experience";
import { RpgExperienceRewarder } from "../rpg/rpg-experience-rewarder";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgPlayerAggregatedBuffs } from "../rpg/rpg-player-aggregated-buffs";
import { RpgPlayerAttributes } from "../rpg/rpg-player-attributes";
import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { RpgPlayerStatus } from "../rpg/rpg-player-status";

function devCreateRpgLoot() {
    const experienceState = RpgExperience.createState();
    const aggregatedBuffs = new RpgPlayerAggregatedBuffs(
        new RpgCharacterEquipment(RpgCharacterEquipment.createState()),
    );
    const experienceRewarder = new RpgExperienceRewarder(
        experienceState,
        aggregatedBuffs,
        new RpgPlayerStatus(
            RpgPlayerStatus.createState(),
            new RpgPlayerAttributes(
                RpgPlayerAttributes.createState(),
                aggregatedBuffs,
            ),
            aggregatedBuffs,
        ),
    );
    const experience = new RpgExperience(experienceState, experienceRewarder);
    return new RpgLoot(experience);
}

export function devSimulateLoot(table: RpgLoot.Table, buffs = RpgPlayerBuffs.create()) {
    const loot = devCreateRpgLoot();

    const { status } = RpgEnemyRank.create({});

    const counts = {
        equipments: new Map<DataEquipment.Id, Integer>(),
        flops: new Map<Integer, Integer>(),
        keyItems: new Map<DataKeyItem.Id, Integer>(),
        pocketItems: new Map<DataPocketItem.Id, Integer>(),
        potions: new Map<DataPotion.Id, Integer>(),
        valuables: new Map<Integer, Integer>(),
    };

    const iterationsCount = 100000;

    for (let i = 0; i < iterationsCount; i++) {
        const drop = loot.drop(table, status, buffs.loot);
        increment(counts.equipments, drop.equipments);
        increment(counts.flops, drop.flops);
        increment(counts.keyItems, drop.keyItems);
        increment(counts.pocketItems, drop.pocketItems);
        increment(counts.potions, drop.potions);
        increment(counts.valuables, drop.valuables);
    }

    console.log(`====Loot simulation result (${iterationsCount} iterations)====
${print({ iterationsCount, map: counts.equipments, name: "Equipment", serializer: (item) => item })}
${
        print({
            iterationsCount,
            map: counts.flops,
            name: `Flops ${
                printPercentage([...counts.flops.values()].reduce((value, next) => value + next, 0), iterationsCount)
            }`,
            serializer: (item) => `#${item + 1}`,
        })
    }
${print({ iterationsCount, map: counts.keyItems, name: "Key Items", serializer: (item) => item })}
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
