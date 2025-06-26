export function clone<T>(obj: T): T {
    // TODO: note `structuredClone` is only available in Electron 17+
    if ("structuredClone" in window) {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
