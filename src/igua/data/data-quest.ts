import { Integer } from "../../lib/math/number-alias-types";
import { Null } from "../../lib/types/null";
import { RpgFoodOrder } from "../rpg/rpg-food-order";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";

export namespace DataQuest {
    export const { manifest, getById } = DataLib.create(
        "DataQuest",
        {
            "NewBalltown.Armorer.ReceivedFish": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeStrengthUp" },
                },
            },
            "NewBalltown.Fanatic.FruitDelivery": {
                flags: null,
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "potion", id: "RestoreHealth", count: 3 },
                        { kind: "potion", id: "RestoreHealth", count: 4 },
                        { kind: "potion", id: "AttributeIntelligenceUp" },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "currency", id: "valuables", count: 50 },
                    },
                },
            },
            "NewBalltown.Homeowner.EnemyPresenceCleared": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "currency", id: "valuables", count: 100 },
                },
            },
            "NewBalltown.RisingFace": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeHealthUp" },
                },
            },
            "NewBalltown.Tunneler.ReceivedOrder": {
                flags: {
                    foodOrder: Null<{ seed: Integer; difficulty: RpgFoodOrder.Difficulty }>(),
                },
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "equipment", id: "RichesRing", level: 1 },
                        { kind: "equipment", id: "YellowRichesRing", level: 1 },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "currency", id: "valuables", count: 50 },
                    },
                },
            },
            "StrangeMarket.Restaurant.EnemyPresenceCleared": {
                flags: null,
                reward: {
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
            BeetGod: {
                flags: null,
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "equipment", id: "ApprovalIndianaMerchants", level: 1 },
                        { kind: "equipment", id: "NailFile", level: 1 },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "key_item", id: "FlopBlindBox", count: 5 },
                    },
                },
            },
            WheatGod: {
                flags: null,
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "equipment", id: "StrengthUp", level: 1 },
                        { kind: "equipment", id: "NailFile", level: 1 },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "key_item", id: "FlopBlindBox", count: 5 },
                    },
                },
            },
            GreatTower: {
                flags: null,
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "equipment", id: "StrengthUp", level: 1 },
                        { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 2 },
                        { kind: "potion", id: "AttributeStrengthUp" },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "potion", id: "RestoreHealth", count: 2 },
                    },
                },
            },
            "GreatTower.EnemyHearts": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 3 },
                },
            },
            "GreatTower.EfficientHome.Ringer.ReceivedFish": {
                flags: null,
                reward: {
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
            "GreatTower.EfficientHome.NeatFreak.DidntWearEquipment": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "IqIndicator", level: 1 },
                },
            },
            "GreatTower.EfficientHome.Snail.Defeated": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "WalkTopSpeedAndMusicTempoDown", level: 1 },
                },
            },
            "GreatTower.Balcony.Fisherman.Appeased": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "key_item", id: "MagicKey" },
                },
            },
            SimpleSecretHappy: {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "WetnessCapacityUp", level: 1 },
                },
            },
            "RaceTrack.WonRace": {
                flags: null,
                reward: {
                    kind: "repeat",
                    drop: { kind: "equipment", id: "MusicTempoUp", level: 1 },
                },
            },
            "RaceTrack.MysteriousIguana": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "SceneChangeErrorChanceUp", level: 1 },
                },
            },
            "ErrorRecoveryRoom.Hubol": {
                flags: null,
                reward: {
                    kind: "repeat",
                    drop: { kind: "potion", id: "RestoreHealth", count: 2 },
                },
            },
            "VaseInhabitant.Saved": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "PatheticCage", level: 1 },
                },
            },
            "VaseInhabitant.CombinedCactusFruits": {
                flags: null,
                reward: {
                    kind: "repeat",
                    drop: { kind: "equipment", id: "PatheticCage", level: 1 },
                },
            },
            "Grotto.PocketTeacher.ReceivedManyPocketItems": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeHealthUp" },
                },
            },
            "Grotto.QuestTeacher.GuessedSongsCorrectly": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeHealthUp" },
                },
            },
            "FallenBot.PerfectScore": {
                flags: null,
                reward: {
                    countCompletions: "always",
                    kind: "single",
                    drop: { kind: "key_item", id: "TeenerBot" },
                },
            },
            "SuggestiveCavern.SimpleBot.Hair": {
                flags: null,
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "potion", id: "AttributeHealthUp" },
                        { kind: "potion", id: "AttributeHealthUp" },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "potion", id: "RestoreHealth", count: 1 },
                    },
                },
            },
            "MishaHouse.DestroyedComputer": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "IqIndicator", level: 1 },
                },
            },
            "MishaHouse.WarmedWaterHeater": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "Robotic", level: 1 },
                },
            },
            "MountFlop.Flower": {
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "SpellOpenFlopBlindBoxes", level: 1 },
                },
            },
            __Fallback__: {
                flags: null,
                reward: {
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
        } satisfies Record<string, Model<unknown>>,
    );

    export interface Model<TFlags> {
        flags: TFlags | null;
        reward: Reward;
    }

    export namespace Reward {
        export type Drop = Drop.Type | Drop.Type[];

        export namespace Drop {
            export type Type = (RpgInventory.Item | { kind: "currency"; id: "valuables" }) & { count?: Integer };

            export namespace Type {
                export type Flattened = Required<Type>[];
            }

            const flattenedCache = new Map<Drop, Type.Flattened>();

            export function flatten(drop: Drop): Type.Flattened {
                const cached = flattenedCache.get(drop);

                if (cached) {
                    return cached;
                }

                const value: Type.Flattened = (Array.isArray(drop) ? drop : [drop])
                    .map(({ count = 1, ...drop }) => ({ ...drop, count }));

                flattenedCache.set(drop, value);
                return value;
            }
        }

        namespace Extend {
            export interface Repeat {
                kind: "repeat";
                drop: Drop;
            }
        }

        type Extend = Extend.Repeat | null;

        export interface InOrder {
            kind: "in_order";
            drops: Array<Drop>;
            extend: Extend;
        }

        export interface Repeat {
            kind: "repeat";
            drop: Drop;
        }

        export interface Single {
            kind: "single";
            countCompletions: "always" | "once";
            drop: Drop;
        }

        export interface Nothing {
            kind: "nothing";
            countCompletions: "always" | "once";
        }

        export interface Base {
        }
    }

    export type Reward = (Reward.InOrder | Reward.Repeat | Reward.Single | Reward.Nothing) & Reward.Base;

    export type Id = DataLib.Id<typeof manifest>;
    export type Flags<TId> = TId extends Id ? typeof manifest[TId]["flags"] : never;
}
