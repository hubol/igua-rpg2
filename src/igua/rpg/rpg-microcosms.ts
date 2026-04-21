import { MicrocosmCactusEquipmentMaker } from "./microcosms/microcosm-cactus-equipment-maker";
import { MicrocosmVase } from "./microcosms/microcosm-vase";
import { RpgMicrocosm, RpgMicrocosmUnsafeBase } from "./rpg-microcosm";

const Manifest = {
    "VaseInhabitant.CactusEquipment": construct(MicrocosmCactusEquipmentMaker, {}),
    "VaseInhabitant.Vase": construct(MicrocosmVase, {}),
};

interface RpgMicrocosmClasslike<T> {
    new(arg: T): RpgMicrocosm<unknown>;
}

function construct<TArg, TClass extends RpgMicrocosmClasslike<TArg>>(_class: TClass, _arg: TArg): [TClass, TArg] {
    return [_class, _arg];
}

export namespace RpgMicrocosms {
    export function create(state: State): Instance {
        return Object.fromEntries(
            Object.entries(Manifest).map(([key, [microcosmClass, microcosmArg]]) => {
                const instance = new (microcosmClass as RpgMicrocosmClasslike<unknown>)(microcosmArg);
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
