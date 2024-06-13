const trimToRelativePath = (() => {
    const dirLength = process.cwd().length + 1;
    /**
     * @param { string } path
     */
    return (path) => path.substring(dirLength);
})();

/**
 * 
 * @param {{ path: string, type: string }[]} events 
 */
function printEvents(events) {
    const pathsByType = {};
    for (const { type, path } of events) {
        if (!pathsByType[type])
            pathsByType[type] = [];

        pathsByType[type].push(trimToRelativePath(path));
    }

    const created = pathsByType["create"] ? "create: " + pathsByType["create"].join(", ") + "\n" : "";
    const updated = pathsByType["update"] ? "update: " + pathsByType["update"].join(", ") + "\n" : "";
    const deleted = pathsByType["delete"] ? "delete: " + pathsByType["delete"].join(", ") + "\n" : "";

    let body = created + updated + deleted;
    if (!body)
        body = "<No events>";

    console.log("Change detected:\n" + body.trim() + "\n");
}

/**
 * @param {string} dir
 * @param {Function} onEvents 
 */
export async function startParcelWatcher(dir, onEvents, ignore = []) {
    try {
        const { subscribe } = await import("../../.smooch/native-deps/node_modules/@parcel/watcher/index.js");
        await subscribe(
            dir,
            (err, events) => {
                // https://stackoverflow.com/a/26373971
                process.stdout.write('\x1Bc')
                if (err) {
                    console.error("Got error from @parcel/watcher\n", err);
                    return;
                }

                printEvents(events);
                setImmediate(onEvents);
            },
        { ignore: [ 'node_modules/', '.git/', '.smooch/', '**/node_modules/**/*', ...ignore ] });
        return true;
    }
    catch (e) {
        console.warn("Could not start @parcel/watcher. It should have been installed by smooch.\n", e);
        return false;
    }
}