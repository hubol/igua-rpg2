import { Integer } from "../../lib/math/number-alias-types";
import { Null } from "../../lib/types/null";
import { DataNpcPersona } from "../data/data-npc-persona";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgClassrooms } from "./rpg-classrooms";
import { RpgExperience } from "./rpg-experience";
import { RpgFacts } from "./rpg-facts";
import { RpgFlops } from "./rpg-flops";
import { RpgFoodOrder } from "./rpg-food-order";
import { RpgIdols } from "./rpg-idols";
import { RpgIguanaNpcs } from "./rpg-iguana-npcs";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgLooseValuables } from "./rpg-loose-valuables";
import { RpgPlayer } from "./rpg-player";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPlayerStatus } from "./rpg-player-status";
import { RpgPlayerWallet } from "./rpg-player-wallet";
import { RpgPocket } from "./rpg-pocket";
import { RpgPotions } from "./rpg-potions";
import { RpgQuests } from "./rpg-quests";
import { RpgShops } from "./rpg-shops";
import { RpgStashPockets } from "./rpg-stash-pockets";
import { RpgWeightedPedestals } from "./rpg-weighted-pedestals";

export function getInitialRpgProgress() {
    return {
        character: {
            facts: RpgFacts.createState(),
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
            ...RpgPlayer.createState(),
        },
        flags: {
            classrooms: {
                approvedForTeachingBy: Null<DataNpcPersona.Id>(),
            },
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
                        ringer: Null<"handed_off_to_player">(),
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
                tunneler: {
                    foodOrder: Null<{ seed: Integer; difficulty: RpgFoodOrder.Difficulty }>(),
                    isLeftDoorLocked: true,
                },
            },
            colosseum: {
                ballista: {
                    bolts: 0,
                },
                watcher: {
                    toldPlayerAboutStrangeMarketFightingTechnique: false,
                },
            },
            strangeMarket: {
                greeter: {
                    gavePlayerPoisonRing: false,
                },
            },
            greatTower: {
                balcony: {
                    lever0: false,
                    lever1: false,
                    lever2: false,
                },
                efficientHome: {
                    artSeed: Null<Integer>(),
                    ringer: {
                        toldPlayerAboutDesireForFish: false,
                    },
                },
            },
            vase: {
                moistureUnits: 0,
            },
        },
        programmaticFlags: {
            classrooms: RpgClassrooms.createState(),
            looseValuables: RpgLooseValuables.createState(),
            idols: RpgIdols.createState(),
            iguanaNpcs: RpgIguanaNpcs.createState(),
            quests: RpgQuests.createState(),
            revealedWorldMapGateUids: new Set<Integer>(),
            shops: RpgShops.createState(),
            stashPockets: RpgStashPockets.createState(),
            weightedPedestals: RpgWeightedPedestals.createState(),
        },
    };
}

export type RpgProgressData = ReturnType<typeof getInitialRpgProgress>;
