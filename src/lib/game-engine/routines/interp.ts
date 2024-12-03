import { nlerp } from "../../math/number";
import { PropertiesLike } from "../../types/properties-like";

export function interp<T>(object: T, key: keyof PropertiesLike<T, number>) {
    return {
        steps: (count: number) => {
            return {
                to: toFn(
                    object,
                    key,
                    (start, target, factor) => nlerp(start, target, Math.floor(factor * count) / count),
                ),
            };
        },
        to: toFn(object, key, nlerp),
    };
}

type InterpFn = (start: number, target: number, factor: number) => number;

function toFn<T>(object: T, key: keyof PropertiesLike<T, number>, fn: InterpFn) {
    return (target: number) => ({
        over: (ms: number) => {
            let currentTick = 0;
            const start = object[key] as unknown as number;

            return () => {
                currentTick++;
                // TODO Fixed FPS
                const currentMs = (currentTick * 1000) / 60;
                const factor = Math.min(currentMs / ms, 1);

                /// @ts-expect-error
                object[key] = fn(start, target, factor);

                return factor >= 1;
            };
        },
    });
}
