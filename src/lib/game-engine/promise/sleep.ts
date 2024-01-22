import { wait } from "./wait";

export async function sleep(ms: number) {
    if (ms <= 0)
        return;

    // TODO Fixed FPS
    // 60frames / 1000ms
    ms *= 0.06;
    await wait(() => --ms <= 0);
}