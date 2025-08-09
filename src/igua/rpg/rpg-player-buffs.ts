import { Integer, PercentAsInteger } from "../../lib/math/number-alias-types";
import { compileResetter } from "../../lib/object/compile-resetter";

export namespace RpgPlayerBuffs {
    export function create() {
        return {
            attributes: {
                intelligence: 0,
            },
            combat: {
                defense: {
                    faction: {
                        miner: 0,
                    },
                },
                melee: {
                    attack: {
                        physical: 0,
                    },
                    conditions: {
                        poison: 0,
                    },
                    clawAttack: {
                        physical: 0,
                    },
                },
            },
            loot: {
                pocket: {
                    bonusChance: <PercentAsInteger> 0,
                },
                tiers: {
                    nothingRerollCount: 0,
                },
                valuables: {
                    bonus: 0,
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

    export const voidMutator: MutatorFn = () => {};
}
