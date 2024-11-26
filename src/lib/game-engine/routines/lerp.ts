import { nlerp } from "../../math/number";
import { PropertiesLike } from "../../types/properties-like";

export const lerp = _interp(nlerp);

export const interp = {
    steps(count: number) {
        return _interp((start, target, factor) => nlerp(start, target, Math.floor(factor * count) / count));
    },
};

type InterpFn = (start: number, target: number, factor: number) => number;

function _interp(fn: InterpFn) {
    return <T>(object: T, key: keyof PropertiesLike<T, number>) => ({
        to(target: number) {
            return {
                over(ms: number) {
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
            };
        },
    });
}
