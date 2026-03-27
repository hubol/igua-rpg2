type PrimitiveProvider = (() => boolean) | (() => string | null) | (() => number);

export function onPrimitiveMutate(provider: PrimitiveProvider) {
    const value = provider();
    return () => value !== provider();
}
