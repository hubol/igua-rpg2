export const TestPromise = {
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
    flush: () => TestPromise.sleep(1),
};
