export function intervalWait(predicate: () => boolean) {
    let interval: number;

    return new Promise<void>(resolve => {
        interval = setInterval(() => {
            if (predicate()) {
                resolve();
            }
        });
    })
        .finally(() => interval !== undefined && clearInterval(interval));
}
