import { MicrocosmCactusEquipmentMaker } from "./microcosms/microcosm-cactus-equipment-maker";
import { MicrocosmVase } from "./microcosms/microcosm-vase";
import { RpgMicrocosm, RpgMicrocosmUnsafeBase } from "./rpg-microcosm";

const Manifest = {
    "VaseInhabitant.CactusEquipment": configure(MicrocosmCactusEquipmentMaker, {}),
    "VaseInhabitant.Vase": configure(MicrocosmVase, { maxWetnessUnits: 1000 }),
    "NewBalltown.Armorer.AquariumWater": configure(MicrocosmVase, { maxWetnessUnits: 300, requirePurity: 150 }),
};

interface RpgMicrocosmClasslike<T> {
    new(config: T): RpgMicrocosm<unknown>;
}

function configure<TConfig, TClass extends RpgMicrocosmClasslike<TConfig>>(
    microcosmClass: TClass,
    config: TConfig,
): [TClass, TConfig] {
    return [microcosmClass, config];
}

export namespace RpgMicrocosms {
    export function create(state: State): Instance {
        return Object.fromEntries(
            Object.entries(Manifest).map(([key, [microcosmClass, config]]) => {
                const instance = new (microcosmClass as RpgMicrocosmClasslike<unknown>)(config);
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
        [k in keyof ManifestType]: InstanceType<ManifestType[k][0]>;
    };
}
