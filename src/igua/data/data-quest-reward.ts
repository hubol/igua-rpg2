import { Integer } from "../../lib/math/number-alias-types";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";

export namespace DataQuestReward {
    export type Reward = (RpgInventory.Item | { kind: "currency"; id: "valuables" }) & { count?: Integer };

    namespace Extend {
        export interface Repeat {
            kind: "repeat";
            reward: DataQuestReward.Reward;
        }
    }

    type Extend = Extend.Repeat | null;

    namespace Model {
        export interface InOrder {
            kind: "in_order";
            rewards: Array<DataQuestReward.Reward>;
            extend: Extend;
        }

        export interface Single {
            kind: "single";
            reward: DataQuestReward.Reward;
        }
    }

    export type Model = Model.InOrder | Model.Single;

    export const Manifest = DataLib.createManifest(
        {
            "NewBalltown.Armorer.ReceivedFish": {
                kind: "single",
                reward: { kind: "potion", id: "AttributeStrengthUp" },
            },
            "NewBalltown.Fanatic.FruitDelivery": {
                kind: "in_order",
                rewards: [
                    { kind: "currency", id: "valuables", count: 50 },
                    { kind: "currency", id: "valuables", count: 50 },
                    { kind: "currency", id: "valuables", count: 50 },
                    { kind: "currency", id: "valuables", count: 50 },
                    { kind: "potion", id: "AttributeIntelligenceUp" },
                ],
                extend: {
                    kind: "repeat",
                    reward: { kind: "currency", id: "valuables", count: 50 },
                },
            },
            "NewBalltown.Homeowner.EnemyPresenceCleared": {
                kind: "single",
                reward: { kind: "currency", id: "valuables", count: 100 },
            },
            "NewBalltown.RisingFace": {
                kind: "single",
                reward: { kind: "potion", id: "AttributeHealthUp" },
            },
            "NewBalltown.Tunneler.ReceivedOrder": {
                kind: "in_order",
                rewards: [
                    { kind: "equipment", id: "RichesRing", level: 1 },
                    { kind: "equipment", id: "YellowRichesRing", level: 1 },
                ],
                extend: {
                    kind: "repeat",
                    reward: { kind: "currency", id: "valuables", count: 50 },
                },
            },
            BeetGod: {
                kind: "in_order",
                rewards: [
                    { kind: "potion", id: "AttributeStrengthUp" },
                    { kind: "equipment", id: "NailFile", level: 1 },
                ],
                extend: {
                    kind: "repeat",
                    reward: { kind: "key_item", id: "FlopBlindBox", count: 5 },
                },
            },
            WheatGod: {
                kind: "in_order",
                rewards: [
                    { kind: "potion", id: "AttributeStrengthUp" },
                    { kind: "equipment", id: "PatheticCage", level: 1 },
                ],
                extend: {
                    kind: "repeat",
                    reward: { kind: "key_item", id: "FlopBlindBox", count: 5 },
                },
            },
            GreatTower: {
                kind: "in_order",
                rewards: [
                    { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 1 },
                    { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 2 },
                    { kind: "potion", id: "AttributeStrengthUp" },
                ],
                extend: {
                    kind: "repeat",
                    reward: { kind: "potion", id: "RestoreHealth", count: 2 },
                },
            },
            __Fallback__: {
                kind: "in_order",
                rewards: [],
                extend: null,
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataRewardPool" });
}
