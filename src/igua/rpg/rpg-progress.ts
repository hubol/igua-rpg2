import { Mzk } from "../../assets/music";
import { Integer } from "../../lib/math/number-alias-types";
import { Null } from "../../lib/types/null";
import { DataNpcPersona } from "../data/data-npc-persona";
import { DataPocketItem } from "../data/data-pocket-item";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgClassrooms } from "./rpg-classrooms";
import { RpgExperience } from "./rpg-experience";
import { RpgFacts } from "./rpg-facts";
import { RpgFlops } from "./rpg-flops";
import { RpgGifts } from "./rpg-gifts";
import { RpgIdols } from "./rpg-idols";
import { RpgIguanaNpcs } from "./rpg-iguana-npcs";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgLooseValuables } from "./rpg-loose-valuables";
import { RpgMicrocosms } from "./rpg-microcosms";
import { RpgPlayer } from "./rpg-player";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPlayerSpells } from "./rpg-player-spells";
import { RpgPlayerStatus } from "./rpg-player-status";
import { RpgPlayerTemporaryEffects } from "./rpg-player-temporary-effects";
import { RpgPlayerWallet } from "./rpg-player-wallet";
import { RpgPocket } from "./rpg-pocket";
import { RpgPotions } from "./rpg-potions";
import { RpgQuests } from "./rpg-quests";
import { RpgRecords } from "./rpg-records";
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
            records: RpgRecords.createState(),
            spells: RpgPlayerSpells.createState(),
            temporaryEffects: RpgPlayerTemporaryEffects.createState(),
            ...RpgPlayer.createState(),
        },
        flags: {
            desert: {
                nerdBouncerSatiated: false,
            },
            flopUniversity: {
                isDirectorVisiting: false,
            },
            grotto: {
                questTeacher: {
                    expectedMzkId: Null<Mzk.Id>(),
                    correctMzkIds: new Set<Mzk.Id>(),
                },
                pocketTeacher: {
                    receivedPocketItemIds: new Set<DataPocketItem.Id>(),
                },
            },
            indianaHall: {
                completedPaintingOnce: false,
            },
            indianaUniversity: {
                isWaterRunning: false,
            },
            classrooms: {
                approvedForTeachingBy: Null<DataNpcPersona.Id>(),
            },
            newBalltown: {
                armorer: {
                    toldPlayerAboutDesireForFish: false,
                },
                fishmonger: {
                    deliveredEquipmentsCount: 0,
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
                guardian: {
                    defeated: false,
                },
            },
            gamblingExpert: {
                locationSeed: 4,
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
            worldMap: {
                fallenBot: {
                    perfectScoreTimes: 0,
                },
            },
        },
        microcosms: RpgMicrocosms.createState(),
        programmaticFlags: {
            classrooms: RpgClassrooms.createState(),
            gifts: RpgGifts.createState(),
            looseValuables: RpgLooseValuables.createState(),
            idols: RpgIdols.createState(),
            iguanaNpcs: RpgIguanaNpcs.createState(),
            quests: RpgQuests.createState(),
            revealedWorldMapGateUids: new Set<Integer>(),
            shops: RpgShops.createState(),
            stashPockets: RpgStashPockets.createState(),
            unlockedMagicDoorUids: new Set<Integer>(),
            weightedPedestals: RpgWeightedPedestals.createState(),
        },
    };
}

export type RpgProgressData = ReturnType<typeof getInitialRpgProgress>;
