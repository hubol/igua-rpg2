import { wait } from "./wait";

export function sleep(ms: number) {
    if (ms <= 0)
        return Promise.resolve();

    // TODO Fixed FPS
    // 60frames / 1000ms
    ms *= 0.06;
    return wait(() => --ms <= 0);
}