import { MicrocosmCactusEquipmentMaker } from "./microcosms/microcosm-cactus-equipment-maker";
import { MicrocosmVase } from "./microcosms/microcosm-vase";
import { RpgMicrocosm, RpgMicrocosmUnsafeBase } from "./rpg-microcosm";

const Manifest = {
    "VaseInhabitant.CactusEquipment": MicrocosmCactusEquipmentMaker,
    "VaseInhabitant.Vase": MicrocosmVase,
} satisfies Record<string, RpgMicrocosmClasslike>;

export namespace RpgMicrocosms {
    export function create(state: State): Instance {
        return Object.fromEntries(
            Object.entries(Manifest).map(([key, microcosmClass]) => {
                const instance = new microcosmClass();
                const unsafeInstance = instance as unknown as RpgMicrocosmUnsafeBase;
                if (!state[key]) {
                    state[key] = unsafeInstance.createState();
                }
                unsafeInstance._state = state[key];
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
        [k in keyof ManifestType]: InstanceType<ManifestType[k]>;
    };
}

interface RpgMicrocosmClasslike {
    new(): RpgMicrocosm<unknown>;
}
