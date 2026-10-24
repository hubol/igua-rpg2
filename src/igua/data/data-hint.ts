import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";
import { DataNpcPersona } from "./data-npc-persona";
import { DataQuest } from "./data-quest";
import { DataShop } from "./data-shop";

export namespace DataHint {
    type Model = Model.Base & (Model.Shop | Model.Quest);

    namespace Model {
        export interface Base {
            messages: string[];
        }

        export interface Shop {
            kind: "shop_stock_purchase";
            shopId: DataShop.Id;
            stockItem: RpgInventory.Item;
        }

        export interface Quest {
            kind: "quest";
            questId: DataQuest.Id;
        }
    }

    export const { manifest, getById } = DataLib.create(
        "DataHint",
        {
            "Indiana.MagicKey0": {
                kind: "quest",
                messages: ["Old Joe, the Great Tower's fisherman, has one."],
                questId: "GreatTower.Balcony.Fisherman.Appeased",
            },
            "Indiana.MagicKey1": {
                kind: "shop_stock_purchase",
                messages: [
                    `One can be purchased for pity from ${
                        DataNpcPersona.getById("PityBoss").name
                    } in the Swamp Casino.`,
                ],
                shopId: "CasinoPity",
                stockItem: { kind: "key_item", id: "MagicKey" },
            },
            "Indiana.MagicKey2": {
                kind: "shop_stock_purchase",
                messages: [
                    `One can be purchased for quest XP from ${
                        DataNpcPersona.getById("QuestTeacher").name
                    } at the nice tree.`,
                ],
                shopId: "QuestTeacher",
                stockItem: { kind: "key_item", id: "MagicKey" },
            },
            "Indiana.MagicKey3": {
                kind: "shop_stock_purchase",
                messages: [
                    `One can be purchased for social XP from ${
                        DataNpcPersona.getById("SocialTeacher").name
                    } at the university.`,
                ],
                shopId: "SocialTeacher",
                stockItem: { kind: "key_item", id: "MagicKey" },
            },
            "Ohio.MagicKey0": {
                kind: "quest",
                messages: [
                    `One can be found in your food by utlizing ${
                        DataNpcPersona.getById("FoodChecker").name
                    }'s services.`,
                ],
                questId: "FoodSafetyDeparment.MetalDiscovered",
            },
            "Ohio.MagicKey1": {
                kind: "quest",
                messages: [
                    `One is held by a powerful foe in the Intelligence Tower.`,
                ],
                questId: "IntelligenceTower.DefeatMidboss0",
            },
            __Fallback__: {
                kind: "quest",
                messages: ["This is a bug"],
                questId: "BeetGod",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;

    export function isNecessary(id: Id) {
        const data = getById(id);
        if (data.kind === "quest") {
            return !Rpg.quest(data.questId).everCompleted;
        }
        else {
            return Rpg.shop(data.shopId).hasAnyStock(data.stockItem);
        }
    }
}
