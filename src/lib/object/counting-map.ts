import { Integer } from "../math/number-alias-types";

export class CountingMap<TKey extends string> {
    private readonly _impl: Partial<Record<TKey, Integer>> = {};

    get(key: TKey): Integer {
        const value = this._impl[key];
        return value ? value : 0;
    }

    increment(key: TKey): Integer {
        return this.set(key, this.get(key) + 1);
    }

    set(key: TKey, value: Integer) {
        return this._impl[key] = value;
    }
}
