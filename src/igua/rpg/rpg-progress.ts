import { DeepKeyOf } from "../../lib/types/deep-keyof";
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
                    value: 0,
                },
            },
            attributes: {
                health: 1,
                intelligence: 0,
                strength: 1,
            },
            looks: getDefaultLooks(),
            position: {
                sceneName: "",
                checkpointName: "",
            },
        },
        flags: {
            outskirts: {
                miner: {
                    picaxeHealth: 10,
                },
            },
            test: false,
        },
        uids: {
            valuables: new Set<number>(),
        },
    };
}

export const RpgProgress = getInitialRpgProgress();

export type RpgProgressUids = keyof typeof RpgProgress["uids"];
// TODO I think some places already expect flags to only be booleans :-X
export type RpgProgressFlags = DeepKeyOf.Leaves<typeof RpgProgress["flags"]>;
