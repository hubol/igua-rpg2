import { Integer, PercentAsInteger } from "../../lib/math/number-alias-types";
import { compileResetter } from "../../lib/object/compile-resetter";

export namespace RpgPlayerBuffs {
    export function create() {
        return {
            attributes: {
                health: 0,
                intelligence: 0,
                strength: 0,
            },
            combat: {
                defense: {
                    physical: <PercentAsInteger> 0,
                    faction: {
                        miner: 0,
                    },
                },
                melee: {
                    faceAttack: {
                        physical: 0,
                    },
                    conditions: {
                        poison: {
                            value: 0,
                            maxLevel: 0,
                        },
                    },
                    clawAttack: {
                        perfect: {
                            attackExperience: 0,
                        },
                        physical: 0,
                    },
                },
            },
            conditions: {
                ballonDrainReductionFactor: <PercentAsInteger> 0,
                wetnessCapacityIncreaseFactor: <PercentAsInteger> 0,
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
