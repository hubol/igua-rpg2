import { Integer, Polar } from "../../lib/math/number-alias-types";
import { DeepKeyOf } from "../../lib/types/deep-keyof";
import { Null } from "../../lib/types/null";
import { DataNpcPersona } from "../data/data-npc-persona";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { Rpg } from "./rpg";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgExperience } from "./rpg-experience";
import { RpgFlops } from "./rpg-flops";
import { RpgIdols } from "./rpg-idols";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPlayer } from "./rpg-player";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPlayerStatus } from "./rpg-player-status";
import { RpgPlayerWallet } from "./rpg-player-wallet";
import { RpgPocket } from "./rpg-pocket";
import { RpgPotions } from "./rpg-potions";
import { RpgQuests } from "./rpg-quests";
import { RpgShops } from "./rpg-shops";
import { RpgStashPockets } from "./rpg-stash-pockets";

export function getInitialRpgProgress() {
    return {
        character: {
            inventory: {
                equipment: RpgCharacterEquipment.createState(),
                flops: RpgFlops.createState(),
                keyItems: RpgKeyItems.createState(),
                pocket: RpgPocket.createState(),
                potions: RpgPotions.createState(),
            },
            wallet: RpgPlayerWallet.createState(),
            status: RpgPlayerStatus.createState(),
            attributes: RpgPlayerAttributes.createState(),
            experience: RpgExperience.createState(),
            quests: RpgQuests.createState(),
            ...RpgPlayer.createState(),
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
            idols: RpgIdols.createState(),
            metNpcPersonaIds: new Set<DataNpcPersona.Id>(),
            revealedWorldMapGateUids: new Set<Integer>(),
            shops: RpgShops.createState(),
            stashPockets: RpgStashPockets.createState(),
        },
    };
}

export type RpgProgressData = ReturnType<typeof getInitialRpgProgress>;

// TODO I think some places already expect flags to only be booleans :-X
export type RpgProgressFlags = DeepKeyOf.Leaves<typeof Rpg["flags"]>;
