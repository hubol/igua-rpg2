export function unsafeIndex<T>(object: T, index: Index<T>): Values<T> | undefined {
    // @ts-expect-error Don't care
    return object[index];
}

type Index<T> = T extends Record<string, unknown> ? string
    : T extends Record<number, unknown> ? number
    : T extends Record<symbol, unknown> ? symbol
    : never;
type Values<T> = T extends Record<any, infer TValues> ? TValues : never;
