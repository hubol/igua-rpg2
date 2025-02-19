import { ColorSource } from "pixi.js";
import { nlerp } from "../../math/number";
import { Unit } from "../../math/number-alias-types";
import { VectorSimple, vnew } from "../../math/vector-type";
import { AdjustColor } from "../../pixi/adjust-color";
import { PropertiesLike } from "../../types/properties-like";
import { Coro } from "./coro";

type FactorFn = (factor: Unit) => Unit;

export function interp<T>(object: T, key: keyof PropertiesLike<T, number>, round = false) {
    return {
        steps: (count: number) => {
            return {
                to: toFn(
                    object,
                    key,
                    round,
                    (factor) => Math.floor(factor * count) / count,
                ),
            };
        },
        factor: (factorFn: FactorFn) => {
            return {
                to: toFn(object, key, round, factorFn),
            };
        },
        to: toFn(object, key, round),
    };
}

export function interpr<T>(object: T, key: keyof PropertiesLike<T, number>) {
    return interp(object, key, true);
}

function toFn<T>(object: T, key: keyof PropertiesLike<T, number>, round: boolean, factorFn?: FactorFn) {
    return (target: number) => ({
        over: (ms: number) => {
            let currentTick = 0;
            let start: number;

            return () => {
                if (currentTick === 0) {
                    start = object[key] as unknown as number;
                }
                currentTick++;
                // TODO Fixed FPS
                const currentMs = (currentTick * 1000) / 60;
                let factor = Math.min(currentMs / ms, 1);

                if (factorFn) {
                    factor = factorFn(factor);
                }

                const value = nlerp(start, target, factor);

                if (round) {
                    (object[key] as number) = Math.round(value);
                }
                else {
                    (object[key] as number) = value;
                }

                return factor >= 1;
            };
        },
    });
}

// Copy-paste doesn't feel great. But what can you do?
export function interpc<T>(object: T, key: keyof PropertiesLike<T, ColorSource>) {
    return {
        steps: (count: number) => {
            return {
                to: colorToFn(
                    object,
                    key,
                    (factor) => Math.floor(factor * count) / count,
                ),
            };
        },
        factor: (factorFn: FactorFn) => {
            return {
                to: colorToFn(object, key, factorFn),
            };
        },
        to: colorToFn(object, key),
    };
}

function colorToFn<T>(object: T, key: keyof PropertiesLike<T, ColorSource>, factorFn?: FactorFn) {
    return (target: ColorSource) => ({
        over: (ms: number) => {
            let currentTick = 0;

            const targetRgb = AdjustColor.pixi(target as number).toRgb({});
            let startRgb: typeof targetRgb;

            return () => {
                if (currentTick === 0) {
                    startRgb = AdjustColor.pixi(object[key] as number).toRgb({});
                }
                currentTick++;
                // TODO Fixed FPS
                const currentMs = (currentTick * 1000) / 60;
                let factor = Math.min(currentMs / ms, 1);

                if (factorFn) {
                    factor = factorFn(factor);
                }

                (object[key] as number) = AdjustColor.rgb(
                    nlerp(startRgb.r, targetRgb.r, factor),
                    nlerp(startRgb.g, targetRgb.g, factor),
                    nlerp(startRgb.b, targetRgb.b, factor),
                ).toPixi();

                return factor >= 1;
            };
        },
    });
}

// Copy-paste doesn't feel great. But what can you do?
export function interpv(vector: VectorSimple, round = false) {
    return {
        steps: (count: number) => {
            return {
                to: vectorToFn(
                    vector,
                    false,
                    round,
                    (factor) => Math.floor(factor * count) / count,
                ),
                translate: vectorToFn(
                    vector,
                    true,
                    round,
                    (factor) => Math.floor(factor * count) / count,
                ),
            };
        },
        factor: (factorFn: FactorFn) => {
            return {
                to: vectorToFn(vector, false, round, factorFn),
                translate: vectorToFn(vector, true, round, factorFn),
            };
        },
        to: vectorToFn(vector, false, round),
        translate: vectorToFn(vector, true, round),
    };
}

export function interpvr(vector: VectorSimple) {
    return interpv(vector, true);
}

type Interpv_Chain_Over = {
    over(ms: number): Coro.Predicate;
};

type Interpv_Chain_ToTranslate = {
    (vector: VectorSimple): Interpv_Chain_Over;
    (x: number, y: number): Interpv_Chain_Over;
};

function vectorToFn<T>(
    vectorToUpdate: VectorSimple,
    isTranslate: boolean,
    round: boolean,
    factorFn?: FactorFn,
) {
    const fn: Interpv_Chain_ToTranslate = (vector_x: VectorSimple | number, y?: number) => ({
        over: (ms: number) => {
            let currentTick = 0;

            const startVector = vnew();
            const targetVector = vnew();

            return () => {
                if (currentTick === 0) {
                    startVector.at(vectorToUpdate);
                    if (typeof vector_x === "number") {
                        targetVector.x = vector_x;
                        targetVector.y = y!;
                    }
                    else {
                        targetVector.x = vector_x.x;
                        targetVector.y = vector_x.y;
                    }
                    if (isTranslate) {
                        targetVector.add(startVector);
                    }
                }
                currentTick++;
                // TODO Fixed FPS
                const currentMs = (currentTick * 1000) / 60;
                let factor = Math.min(currentMs / ms, 1);

                if (factorFn) {
                    factor = factorFn(factor);
                }

                const vx = nlerp(startVector.x, targetVector.x, factor);
                const vy = nlerp(startVector.y, targetVector.y, factor);

                if (round) {
                    vectorToUpdate.x = Math.round(vx);
                    vectorToUpdate.y = Math.round(vy);
                }
                else {
                    vectorToUpdate.x = vx;
                    vectorToUpdate.y = vy;
                }

                return factor >= 1;
            };
        },
    });

    return fn;
}

export const factor = {
    sine(f: number) {
        return Math.sin(f * Math.PI / 2);
    },
};
