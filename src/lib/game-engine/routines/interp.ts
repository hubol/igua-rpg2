import { nlerp } from "../../math/number";
import { Unit } from "../../math/number-alias-types";
import { PropertiesLike } from "../../types/properties-like";

type FactorFn = (factor: Unit) => Unit;

export function interp<T>(object: T, key: keyof PropertiesLike<T, number>) {
    return {
        steps: (count: number) => {
            return {
                to: toFn(
                    object,
                    key,
                    nlerp,
                    (factor) => Math.floor(factor * count) / count,
                ),
            };
        },
        factor: (factorFn: FactorFn) => {
            return {
                to: toFn(object, key, nlerp, factorFn),
            };
        },
        to: toFn(object, key, nlerp),
    };
}

type InterpFn = (start: number, target: number, factor: number) => number;

function toFn<T>(object: T, key: keyof PropertiesLike<T, number>, interpFn: InterpFn, factorFn?: FactorFn) {
    return (target: number) => ({
        over: (ms: number) => {
            let currentTick = 0;
            const start = object[key] as unknown as number;

            return () => {
                currentTick++;
                // TODO Fixed FPS
                const currentMs = (currentTick * 1000) / 60;
                let factor = Math.min(currentMs / ms, 1);

                if (factorFn) {
                    factor = factorFn(factor);
                }

                /// @ts-expect-error
                object[key] = interpFn(start, target, factor);

                return factor >= 1;
            };
        },
    });
}
