export function clone(obj: any) {
    if ("structuredClone" in window) {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
