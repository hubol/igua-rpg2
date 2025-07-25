import { Integer, Polar } from "../../lib/math/number-alias-types";
import { DeepKeyOf } from "../../lib/types/deep-keyof";
import { Empty } from "../../lib/types/empty";
import { Null } from "../../lib/types/null";
import { PropertiesLike } from "../../lib/types/properties-like";
import { DataNpcPersona } from "../data/data-npc-persona";
import { DataPocketItem } from "../data/data-pocket-item";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { Rpg } from "./rpg";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgFlops } from "./rpg-flops";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPocket } from "./rpg-pocket";
import { RpgQuests } from "./rpg-quests";
import { RpgStashPockets } from "./rpg-stash-pockets";
import { RpgStatus } from "./rpg-status";

export function getInitialRpgProgress() {
    return {
        character: {
            inventory: {
                equipment: RpgCharacterEquipment.createState(),
                flops: RpgFlops.create(),
                valuables: 100,
                keyItems: RpgKeyItems.create(),
                pocket: RpgPocket.createState(),
            },
            status: {
                health: 50,
                invulnverable: 0,
                conditions: {
                    helium: {
                        value: 0,
                        ballons: Empty<RpgStatus.Ballon>(),
                    },
                    poison: {
                        level: 0,
                        value: 0,
                    },
                    wetness: {
                        tint: 0xffffff,
                        value: 0,
                    },
                },
            },
            attributes: {
                health: 1,
                intelligence: 0,
                strength: 1,
            },
            experience: {
                combat: 0,
                computer: 0,
                gambling: 0,
                jump: 0,
                pocket: 0,
                quest: 0,
                social: 0,
            },
            looks: getDefaultLooks(),
            position: {
                facing: 1 as Polar,
                sceneName: "",
                checkpointName: "",
            },
            quests: RpgQuests.createState(),
        },
        flags: {
            newBalltown: {
                armorer: {
                    aquarium: {
                        moistureUnits: 0,
                    },
                    toldPlayerAboutDesireForFish: false,
                },
                ballFruitFanatic: {
                    typePreference: Null<RpgPocket.Item>(),
                    succesfulDeliveriesCount: 0,
                },
                fishmonger: {
                    deliveries: {
                        armorer: Null<"ready" | "arrived" | "delivered">(),
                    },
                },
                mechanicalIdol: {
                    credits: 10,
                },
            },
            outskirts: {
                farmer: {
                    hasBagOfSeeds: false,
                },
                miner: {
                    hasUpgradedPickaxe: false,
                    pickaxeHealth: 10,
                    toldPlayerAboutDepletedPickaxeHealth: false,
                },
            },
            underneath: {
                heliumCreator: {
                    tank: {
                        heliumContent: 0,
                        isValveOpen: false,
                    },
                },
                homeowner: {
                    hasClearedHouseOfEnemies: false,
                },
                magicalRisingFace: {
                    reachedSummit: false,
                },
                tunneler: {
                    isLeftDoorLocked: true,
                },
            },
        },
        programmaticFlags: {
            collectedValuableUids: new Set<Integer>(),
            metNpcPersonaIds: new Set<DataNpcPersona.Id>(),
            shopSoldCounts: {} as Record<string, Record<string, Integer>>,
            stashPockets: RpgStashPockets.createState(),
        },
    };
}

export type RpgProgressData = ReturnType<typeof getInitialRpgProgress>;

export type RpgProgressExperience = keyof typeof Rpg["character"]["experience"];

// TODO I think some places already expect flags to only be booleans :-X
export type RpgProgressFlags = DeepKeyOf.Leaves<typeof Rpg["flags"]>;
