export function intervalWait(predicate: () => boolean) {
    return new Promise<void>(resolve => {
        const interval = setInterval(() => {
            if (predicate()) {
                resolve();
                clearInterval(interval);
            }
        })
    })
}
