import { Integer } from "../../lib/math/number-alias-types";
import { Check } from "../../lib/types/check";
import { Null } from "../../lib/types/null";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgFoodOrder } from "../rpg/rpg-food-order";
import { RpgInventory } from "../rpg/rpg-inventory";
import { RpgPocket } from "../rpg/rpg-pocket";
import { DataLib } from "./data-lib";

export namespace DataQuest {
    export const { manifest, getById } = DataLib.create(
        "DataQuest",
        {
            "NewBalltown.Armorer.ReceivedFish": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeStrengthUp" },
                },
            },
            "NewBalltown.Fanatic.FruitDelivery": {
                items: null,
                flags: {
                    preferredFruitPocketId: Null<RpgPocket.Item>(),
                },
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
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "currency", id: "valuables", count: 100 },
                },
            },
            "NewBalltown.RisingFace": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeHealthUp" },
                },
            },
            "NewBalltown.Tunneler.ReceivedOrder": {
                items: null,
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
                items: null,
                flags: null,
                reward: {
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
            BeetGod: {
                items: null,
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
                items: null,
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
                items: null,
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
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 3 },
                },
            },
            "GreatTower.EfficientHome.Ringer.ReceivedFish": {
                items: null,
                flags: null,
                reward: {
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
            "GreatTower.EfficientHome.NeatFreak.DidntWearEquipment": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "IqIndicator", level: 1 },
                },
            },
            "GreatTower.EfficientHome.Snail.Defeated": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "WalkTopSpeedAndMusicTempoDown", level: 1 },
                },
            },
            "GreatTower.Balcony.Fisherman.Appeased": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "key_item", id: "MagicKey" },
                },
            },
            "DarkEvilHole.Rescue": {
                items: null,
                flags: null,
                reward: {
                    kind: "repeat",
                    drop: { kind: "currency", id: "rescue_credits", count: 1 },
                },
            },
            SimpleSecretHappy: {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "WetnessCapacityUp", level: 1 },
                },
            },
            "RaceTrack.WonRace": {
                items: null,
                flags: null,
                reward: {
                    kind: "repeat",
                    drop: { kind: "equipment", id: "MusicTempoUp", level: 1 },
                },
            },
            "RaceTrack.MysteriousIguana": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "SceneChangeErrorChanceUp", level: 1 },
                },
            },
            "ErrorRecoveryRoom.Hubol": {
                items: null,
                flags: null,
                reward: {
                    kind: "repeat",
                    drop: { kind: "potion", id: "RestoreHealth", count: 2 },
                },
            },
            "VaseInhabitant.Saved": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "PatheticCage", level: 1 },
                },
            },
            "VaseInhabitant.CombinedCactusFruits": {
                items: null,
                flags: null,
                reward: {
                    kind: "repeat",
                    drop: { kind: "equipment", id: "PatheticCage", level: 1 },
                },
            },
            "Grotto.PocketTeacher.ReceivedManyPocketItems": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeHealthUp" },
                },
            },
            "Grotto.QuestTeacher.GuessedSongsCorrectly": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "potion", id: "AttributeHealthUp" },
                },
            },
            "FallenBot.PerfectScore": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "always",
                    kind: "single",
                    drop: { kind: "key_item", id: "TeenerBot" },
                },
            },
            "SuggestiveCavern.SimpleBot.Hair": {
                items: null,
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
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "IqIndicator", level: 1 },
                },
            },
            "MishaHouse.WarmedWaterHeater": {
                items: null,
                flags: {
                    pilotFlameLit: false,
                },
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "Robotic", level: 1 },
                },
            },
            "MishaHouse.Birthday": {
                items: null,
                flags: {
                    readCalendar: false,
                    spokeWithBaker: false,
                    spokeWithAidar: false,
                    learnedMishasAge: Null<Integer>(),
                },
                reward: {
                    // TODO
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
            "MountFlop.Flower": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "SpellOpenFlopBlindBoxes", level: 1 },
                },
            },
            "MountFlop.Boxer": {
                items: null,
                flags: null,
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "potion", id: "AttributeHealthUp", count: 2 },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "potion", id: "HotDog", count: 3 },
                    },
                },
            },
            "MountFlop.Cloud": {
                items: null,
                flags: null,
                reward: {
                    countCompletions: "once",
                    kind: "single",
                    drop: { kind: "equipment", id: "OverheatResistance0", level: 1, count: 2 },
                },
            },
            "PlateauIndustry.SoupMaker.AteSoup": {
                items: null,
                flags: {
                    removedOutOfOrderSign: false,
                },
                reward: {
                    countCompletions: "once",
                    kind: "nothing",
                },
            },
            "FoodSafetyDeparment.MetalDiscovered": {
                items: null,
                flags: null,
                reward: {
                    kind: "in_order",
                    drops: [
                        { kind: "key_item", id: "MagicKey" },
                    ],
                    extend: {
                        kind: "repeat",
                        drop: { kind: "currency", id: "valuables", count: 100 },
                    },
                },
            },
            "IntelligenceTower.DefeatMidboss0": {
                items: null,
                flags: null,
                reward: {
                    kind: "single",
                    countCompletions: "once",
                    drop: { kind: "key_item", id: "MagicKey" },
                },
            },
            "OhioUniversity.Bouncer.ReachedTop": {
                items: null,
                flags: {
                    y: Null<Integer>(),
                },
                reward: {
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
            "SinSwamp.FunHouse": {
                items: null,
                flags: null,
                reward: {
                    kind: "single",
                    countCompletions: "once",
                    drop: { kind: "currency", id: "homunculus_bucks", count: 1 },
                },
            },
            "DungeonBones.Researcher": {
                items: null,
                flags: {
                    toldPlayer: false,
                },
                reward: {
                    kind: "single",
                    countCompletions: "once",
                    drop: { kind: "equipment", id: "NightVision", level: 1 },
                },
            },
            "Indiana.HallOfDoors": {
                items: null,
                flags: null,
                reward: {
                    kind: "single",
                    countCompletions: "once",
                    drop: [
                        { kind: "key_item", id: "StaffLight" },
                        { kind: "key_item", id: "StaffFlame" },
                    ],
                },
            },
            "Ohio.HallOfDoors": {
                items: null,
                flags: null,
                reward: {
                    kind: "single",
                    countCompletions: "once",
                    drop: [
                        { kind: "key_item", id: "StaffForest" },
                        { kind: "key_item", id: "StaffWater" },
                    ],
                },
            },
            "FishDelivery.HomunculusWater": {
                items: {
                    fishKeyItem: { kind: "key_item", id: "HomunculusWaterFish" },
                },
                flags: {
                    toldPlayerAboutDesire: false,
                },
                reward: {
                    kind: "single",
                    countCompletions: "once",
                    // TODO something nice
                    drop: [],
                },
            },
            __Fallback__: {
                items: null,
                flags: null,
                reward: {
                    kind: "nothing",
                    countCompletions: "once",
                },
            },
        } satisfies Record<string, Model<unknown, ItemsManifest>>,
    );

    export interface Model<TFlags, TItems extends ItemsManifest> {
        items: TItems;
        flags: TFlags | null;
        reward: Reward;
    }

    type ItemsManifest = Record<string, RpgInventory.Item> | null;

    export namespace Reward {
        export type Drop = Drop.Type | Drop.Type[];

        export namespace Drop {
            export type Type =
                & (RpgInventory.Item | { kind: "currency"; id: RpgEconomy.Currency.Id })
                & { count?: Integer };

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
    export type Items<TId> = TId extends Id ? Readonly<typeof manifest[TId]["items"]> : null;
    export type ItemId<TId> = keyof Items<TId>;
}
