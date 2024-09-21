export function sleep(ms: number) {
    // TODO Fixed FPS
    // 60frames / 1000ms
    ms *= 0.06;
    return () => --ms <= 0;
}
