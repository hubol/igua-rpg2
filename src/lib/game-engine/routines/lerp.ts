import { nlerp } from "../../math/number";
import { PropertiesLike } from "../../types/properties-like";

export function lerp<T>(object: T, key: keyof PropertiesLike<T, number>) {
    return {
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
                        object[key] = nlerp(start, target, factor);

                        return factor >= 1;
                    };
                },
            };
        },
    };
}
