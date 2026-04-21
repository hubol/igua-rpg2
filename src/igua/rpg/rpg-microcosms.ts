import { MicrocosmCactusEquipmentMaker } from "./microcosms/microcosm-cactus-equipment-maker";
import { MicrocosmVase } from "./microcosms/microcosm-vase";
import { RpgMicrocosm, RpgMicrocosmUnsafeBase } from "./rpg-microcosm";

const Manifest = {
    cactusEquipmentMaker: MicrocosmCactusEquipmentMaker,
    vase: MicrocosmVase,
} satisfies Record<string, RpgMicrocosmClasslike>;

export namespace RpgMicrocosms {
    export function create(state: State): Instance {
        return Object.fromEntries(
            Object.entries(Manifest).map(([key, microcosmClass]) => {
                const instance = new microcosmClass();
                (instance as any as RpgMicrocosmUnsafeBase)._state = key in state
                    ? state[key]
                    : instance.createState();
                return [key, instance];
            }),
        ) as unknown as Instance;
    }

    export function createState(): State {
        return {};
    }

    type State = Record<string, any>;

    type ManifestType = typeof Manifest;

    type Instance = {
        [k in keyof ManifestType]: Omit<InstanceType<ManifestType[k]>, "createState">;
    };
}

interface RpgMicrocosmClasslike {
    new(): RpgMicrocosm<unknown>;
}
