import { DeepKeyOf } from "../../lib/types/deep-keyof";
import { getDefaultLooks } from "../iguana/get-default-looks";

function getInitialRpgProgress() {
    return {
        character: {
            valuables: 100,
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
                sceneName: '',
                checkpointName: '',
            }
        },
        flags: {
            test: false,
        },
        uids: {
            valuables: new Set<number>(),
        }
    };
}

export const RpgProgress = getInitialRpgProgress();

export type RpgProgressUids = keyof typeof RpgProgress['uids'];
export type RpgProgressFlags = DeepKeyOf.Leaves<typeof RpgProgress['flags']>;
