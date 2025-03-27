import { Polar } from "../../lib/math/number-alias-types";
import { DeepKeyOf } from "../../lib/types/deep-keyof";
import { Empty } from "../../lib/types/empty";
import { Null } from "../../lib/types/null";
import { PropertiesLike } from "../../lib/types/properties-like";
import { EquipmentInternalName } from "../data/data-equipment";
import { NpcPersonaInternalName } from "../data/data-npc-personas";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPocket } from "./rpg-pocket";
import { RpgQuests } from "./rpg-quests";
import { RpgStatus } from "./rpg-status";

export function getInitialRpgProgress() {
    return {
        character: {
            inventory: {
                valuables: 100,
                keyItems: RpgKeyItems.create(),
                pocket: RpgPocket.create(),
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
            equipment: ["JumpAtSpecialSignsRing", null, null, null] as Array<EquipmentInternalName | null>,
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
            quests: {} as RpgQuests.Model,
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
        uids: {
            metNpcs: new Set<NpcPersonaInternalName>(),
            valuables: new Set<number>(),
        },
    };
}

export let RpgProgress = getInitialRpgProgress();

export function setRpgProgress(rpgProgress: typeof RpgProgress) {
    RpgProgress = rpgProgress;
}

export type RpgProgressExperience = keyof typeof RpgProgress["character"]["experience"];

export type RpgProgressEquipment = typeof RpgProgress["character"]["equipment"];

// TODO not sure if these should be plural
export type RpgProgressUids = keyof PropertiesLike<typeof RpgProgress["uids"], Set<number>>;
// TODO I think some places already expect flags to only be booleans :-X
export type RpgProgressFlags = DeepKeyOf.Leaves<typeof RpgProgress["flags"]>;
