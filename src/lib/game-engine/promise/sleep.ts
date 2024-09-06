import { wait } from "./wait";

export function* sleep(ms: number) {
    if (ms <= 0)
        return;

    // TODO Fixed FPS
    // 60frames / 1000ms
    ms *= 0.06;
    yield* wait(() => --ms <= 0);
}