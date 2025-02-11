export function clone<T>(obj: T): T {
    if ("structuredClone" in window) {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
