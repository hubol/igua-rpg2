import { Integer, Polar } from "../../lib/math/number-alias-types";
import { DeepKeyOf } from "../../lib/types/deep-keyof";
import { Empty } from "../../lib/types/empty";
import { Null } from "../../lib/types/null";
import { DataNpcPersona } from "../data/data-npc-persona";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { Rpg } from "./rpg";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgExperience } from "./rpg-experience";
import { RpgFlops } from "./rpg-flops";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPocket } from "./rpg-pocket";
import { RpgQuests } from "./rpg-quests";
import { RpgShops } from "./rpg-shops";
import { RpgStashPockets } from "./rpg-stash-pockets";
import { RpgStatus } from "./rpg-status";

export function getInitialRpgProgress() {
    return {
        character: {
            inventory: {
                equipment: RpgCharacterEquipment.createState(),
                flops: RpgFlops.create(),
                valuables: 100,
                keyItems: RpgKeyItems.createState(),
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
            experience: RpgExperience.createState(),
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
            shops: RpgShops.createState(),
            stashPockets: RpgStashPockets.createState(),
        },
    };
}

export type RpgProgressData = ReturnType<typeof getInitialRpgProgress>;

// TODO I think some places already expect flags to only be booleans :-X
export type RpgProgressFlags = DeepKeyOf.Leaves<typeof Rpg["flags"]>;
