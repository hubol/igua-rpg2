import { Integer } from "../../../lib/math/number-alias-types";
import { DataEquipment } from "../../data/data-equipment";
import { DataGift } from "../../data/data-gift";
import { DataKeyItem } from "../../data/data-key-item";
import { DataPocketItem } from "../../data/data-pocket-item";
import { DataPotion } from "../../data/data-potion";
import { DataQuest } from "../../data/data-quest";
import { DataShop } from "../../data/data-shop";
import { RpgFactory } from "../../rpg/rpg-factory";
import { RpgInventory } from "../../rpg/rpg-inventory";
import { getInitialRpgProgress } from "../../rpg/rpg-progress";

export function scnDevCheckItems() {
    const questRewards = listQuestRewards();
    const items = listItems();

    const itemsWithSources = items
        .map((item) => ({
            item,
            sources: listItemSources(item, questRewards),
        }));

    console.log(
        "Items with sources\n",
        itemsWithSources
            .filter(value => value.sources.length > 0)
            .map(({ item, sources }) =>
                `${item.id}(${item.kind}) at ${
                    sources.map(source => `${source.name} x${source.quantity}`).join(", ")
                }\n`
            )
            .join("\n"),
    );
    console.warn(
        "Items without sources\n",
        itemsWithSources
            .filter(value => value.sources.length === 0)
            .map(({ item }) => item.id)
            .join("\n"),
    );
}

function listItems() {
    const result = new Array<RpgInventory.Item>();

    for (const id of DataPotion.Ids) {
        result.push({ kind: "potion", id });
    }

    for (const keyItem of Object.values(DataKeyItem.manifest)) {
        result.push({ kind: "key_item", id: keyItem.id });
    }

    for (const id of Object.values(DataEquipment.ids)) {
        result.push({ kind: "equipment", id: id, level: 1 });
    }

    for (const id of Object.values(DataPocketItem.ids)) {
        result.push({ kind: "pocket_item", id: id });
    }

    return result;
}

function listQuestRewards() {
    interface QuestReward {
        id: string;
        items: RpgInventory.Item[];
    }
    const rpg = RpgFactory.create(getInitialRpgProgress());
    const result = new Array<QuestReward>();

    for (const quest of Object.values(DataQuest.manifest)) {
        const items = new Array<RpgInventory.Item>();

        for (let i = 0; i < 10; i++) {
            const reward = rpg.quest(quest.id).complete();

            for (const drop of reward?.drops ?? []) {
                if (drop.kind === "currency") {
                    continue;
                }

                for (let i = 0; i < drop.count; i++) {
                    items.push(drop);
                }
            }
        }

        result.push({ id: quest.id, items });
    }

    return result;
}

type QuestRewards = ReturnType<typeof listQuestRewards>;

function listItemSources(item: RpgInventory.Item, questRewards: QuestRewards): Array<ItemSource> {
    const result = new Array<ItemSource>();
    for (const shop of Object.values(DataShop.manifest)) {
        const quantity = shop.stocks
            .filter(stock => areEqual(item, stock.product))
            .reduce((sum, stock) => sum + stock.initialQuantity, 0);
        if (quantity > 0) {
            result.push({ name: `Shop(${shop.id})`, quantity });
        }
    }

    for (const gift of Object.values(DataGift.manifest)) {
        if (areEqual(gift.item, item)) {
            result.push({ name: `Gift(${gift.id})`, quantity: 1 });
        }
    }

    for (const questReward of questRewards) {
        const quantity = questReward.items
            .filter(rewardItem => areEqual(item, rewardItem))
            .length;

        if (quantity > 0) {
            result.push({ name: `Quest(${questReward.id})`, quantity });
        }
    }

    return result;
}

interface ItemSource {
    name: string;
    quantity: Integer;
}

function areEqual(a: RpgInventory.Item, b: RpgInventory.Item) {
    return a.kind === b.kind && a.id === b.id;
}
