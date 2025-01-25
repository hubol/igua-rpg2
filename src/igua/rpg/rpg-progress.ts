import { DeepKeyOf } from "../../lib/types/deep-keyof";
import { Null } from "../../lib/types/null";
import { PropertiesLike } from "../../lib/types/properties-like";
import { NpcPersonaInternalName } from "../data/npc-personas";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { RpgPocket } from "./rpg-pocket";

function getInitialRpgProgress() {
    return {
        character: {
            inventory: {
                valuables: 100,
                pocket: RpgPocket.create(),
            },
            status: {
                health: 50,
                invulnverable: 0,
                poison: {
                    level: 0,
                    value: 0,
                },
                wetness: {
                    tint: 0xffffff,
                    value: 0,
                },
            },
            attributes: {
                health: 1,
                intelligence: 0,
                strength: 1,
            },
            experience: {
                gambling: 0,
                social: 0,
            },
            looks: getDefaultLooks(),
            position: {
                sceneName: "",
                checkpointName: "",
            },
        },
        flags: {
            newBalltown: {
                armorer: {
                    aquarium: {
                        moistureUnits: 0,
                    },
                },
                ballFruitFanatic: {
                    typePreference: Null<RpgPocket.Item>(),
                    succesfulDeliveriesCount: 0,
                },
            },
            outskirts: {
                miner: {
                    picaxeHealth: 10,
                },
            },
            test: false,
        },
        uids: {
            metNpcs: new Set<NpcPersonaInternalName>(),
            valuables: new Set<number>(),
        },
    };
}

export const RpgProgress = getInitialRpgProgress();

export type RpgProgressExperience = keyof typeof RpgProgress["character"]["experience"];

// TODO not sure if these should be plural
export type RpgProgressUids = keyof PropertiesLike<typeof RpgProgress["uids"], Set<number>>;
// TODO I think some places already expect flags to only be booleans :-X
export type RpgProgressFlags = DeepKeyOf.Leaves<typeof RpgProgress["flags"]>;
