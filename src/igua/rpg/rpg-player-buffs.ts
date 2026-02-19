import { Integer, PercentInt } from "../../lib/math/number-alias-types";
import { compileResetter } from "../../lib/object/compile-resetter";
import { RpgExperience } from "./rpg-experience";

export namespace RpgPlayerBuffs {
    export function create() {
        return {
            approval: {
                // TODO support for booleans?
                indianaMerchants: <PercentInt> 0,
            },
            attributes: {
                health: 0,
                intelligence: 0,
                strength: 0,
            },
            audio: {
                musicTempoAdjustmentFactor: <PercentInt> 0,
            },
            combat: {
                defense: {
                    physical: <PercentInt> 0,
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
                            combatExperience: 0,
                        },
                        physical: 0,
                    },
                },
            },
            conditions: {
                ballonDrainReductionFactor: <PercentInt> 0,
                poisonMaxIncreaseFactor: <PercentInt> 0,
                poisonRateReductionFactor: <PercentInt> 0,
                wetnessMaxIncreaseFactor: <PercentInt> 0,
            },
            esoteric: {
                sceneChangeErrorChance: <PercentInt> 0,
            },
            experience: {
                bonusFactorWhileWet: {
                    combat: 0,
                    computer: 0,
                    gambling: 0,
                    jump: 0,
                    pocket: 0,
                    quest: 0,
                    social: 0,
                    spirit: 0,
                } satisfies Record<RpgExperience.Id, PercentInt>,
            },
            loot: {
                pocket: {
                    bonusChance: <PercentInt> 0,
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
                walk: {
                    topSpeedIncreaseFactor: <PercentInt> 0,
                },
            },
        };
    }

    export const clear = compileResetter(create());

    export type Model = ReturnType<typeof create>;

    export type MutatorFn = (model: Model, bonus: Integer) => void;

    export const voidMutator: MutatorFn = () => {};
}
