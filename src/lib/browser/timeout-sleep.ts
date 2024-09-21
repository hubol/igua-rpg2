export function timeoutSleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}
