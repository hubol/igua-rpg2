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

        export interface Repeat {
            kind: "repeat";
            reward: DataQuestReward.Reward;
        }

        export interface Single {
            kind: "single";
            reward: DataQuestReward.Reward;
        }

        export interface Nothing {
            kind: "nothing";
        }

        export interface Base {
            /** Default is assumed to be `"always"` */
            countCompletions?: "once" | "always";
        }
    }

    export type Model = (Model.InOrder | Model.Repeat | Model.Single | Model.Nothing) & Model.Base;

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
            "StrangeMarket.Restaurant.EnemyPresenceCleared": {
                kind: "nothing",
            },
            BeetGod: {
                kind: "in_order",
                rewards: [
                    { kind: "equipment", id: "ApprovalIndianaMerchants", level: 1 },
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
                    { kind: "equipment", id: "StrengthUp", level: 1 },
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
                    { kind: "equipment", id: "StrengthUp", level: 1 },
                    { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 2 },
                    { kind: "potion", id: "AttributeStrengthUp" },
                ],
                extend: {
                    kind: "repeat",
                    reward: { kind: "potion", id: "RestoreHealth", count: 2 },
                },
            },
            "GreatTower.EnemyHearts": {
                kind: "single",
                reward: { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 3 },
            },
            "GreatTower.EfficientHome.Ringer.ReceivedFish": {
                kind: "nothing",
            },
            "GreatTower.EfficientHome.NeatFreak.DidntWearEquipment": {
                kind: "single",
                reward: { kind: "equipment", id: "IqIndicator", level: 1 },
                countCompletions: "once",
            },
            SimpleSecretHappy: {
                kind: "single",
                reward: { kind: "equipment", id: "WetnessCapacityUp", level: 1 },
                countCompletions: "once",
            },
            "RaceTrack.WonRace": {
                kind: "repeat",
                reward: { kind: "equipment", id: "MusicTempoUp", level: 1 },
            },
            "RaceTrack.MysteriousIguana": {
                kind: "single",
                reward: { kind: "equipment", id: "SceneChangeErrorChanceUp", level: 1 },
                countCompletions: "once",
            },
            __Fallback__: {
                kind: "nothing",
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataRewardPool" });
}
