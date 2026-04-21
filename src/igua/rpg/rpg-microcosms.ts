import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { MicrocosmCactusEquipmentMaker } from "./microcosms/microcosm-cactus-equipment-maker";
import { MicrocosmDownloadData } from "./microcosms/microcosm-download-data";
import { MicrocosmTimeDroppedLoot } from "./microcosms/microcosm-time-dropped-loot";
import { MicrocosmWetnessReceptacle } from "./microcosms/microcosm-wetness-receptacle";
import { RpgMicrocosm, RpgMicrocosmUnsafeBase } from "./rpg-microcosm";

const Manifest = {
    "VaseInhabitant.CactusEquipment": configure(MicrocosmCactusEquipmentMaker, {}),
    "VaseInhabitant.Vase": configure(MicrocosmWetnessReceptacle, { maxWetnessUnits: 1000 }),
    "NewBalltown.Armorer.AquariumWater": configure(MicrocosmWetnessReceptacle, {
        maxWetnessUnits: 300,
        requirePurity: 150,
    }),
    "GreatTower.EfficientHome.Nerd.DownloadData": configure(MicrocosmDownloadData, {}),
    "FallenBot.IsSurfaced": configure(MicrocosmTimeDroppedLoot, {
        replenishFn: (previous: Integer | null) => previous === null ? 10 : Rng.intc(10, 20),
    }),
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
