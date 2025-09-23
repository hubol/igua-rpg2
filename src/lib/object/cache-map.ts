export class CacheMap<TKey extends string, TValue> {
    private readonly _impl: Partial<Record<TKey, TValue>> = {};

    constructor(private readonly _initFn: (key: TKey) => TValue) {
    }

    get(key: TKey): TValue {
        const value = this._impl[key];

        if (value) {
            return value;
        }

        const newValue = this._initFn(key);
        this._impl[key] = newValue;
        return newValue;
    }
}
