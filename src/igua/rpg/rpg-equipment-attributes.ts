import { Integer } from "../../lib/math/number-alias-types";
import { DeepPartial } from "../../lib/types/deep-partial";

export namespace RpgEquipmentAttributes {
    export function create(model: DeepPartial<Model>): Model {
        return {
            loot: {
                valuables: {
                    constant: model?.loot?.valuables?.constant ?? 0,
                },
            },
            quirks: {
                enablesHighJumpsAtSpecialSigns: model?.quirks?.enablesHighJumpsAtSpecialSigns ?? false,
            },
        };
    }

    export interface Model {
        loot: {
            valuables: {
                // TODO use somewhere :-)
                constant: Integer;
            };
        };
        quirks: {
            enablesHighJumpsAtSpecialSigns: boolean;
        };
    }
}
