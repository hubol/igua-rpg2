type PrimitiveProvider = (() => boolean) | (() => string) | (() => number);

export function onPrimitiveMutate(provider: PrimitiveProvider) {
    const value = provider();
    return () => value !== provider();
}
