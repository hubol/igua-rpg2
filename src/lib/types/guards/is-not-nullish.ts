export function isNotNullish<T>(item: T | null): item is T {
    return item !== null;
}
