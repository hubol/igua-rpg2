import { Integer } from "../../lib/math/number-alias-types";
import { compileResetter } from "../../lib/object/compile-resetter";

export namespace RpgEquipmentEffects {
    export function create() {
        return {
            combat: {
                melee: {
                    conditions: {
                        poison: 0,
                    },
                },
            },
            motion: {
                jump: {
                    bonusAtSpecialSigns: 0,
                },
            },
        };
    }

    export const clear = compileResetter(create());

    export type Model = ReturnType<typeof create>;

    export type MutatorFn = (model: Model, bonus: Integer) => void;
}
