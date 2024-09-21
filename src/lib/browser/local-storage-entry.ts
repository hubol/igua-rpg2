import { Serializer } from "../object/serializer";

export class LocalStorageEntry<T> {
    constructor(readonly key: string) {}

    get value(): T | undefined {
        const value = localStorage.getItem(this.key);
        if (value) {
            return Serializer.deserialize(value);
        }
    }

    set value(value: T) {
        localStorage.setItem(this.key, Serializer.serialize(value));
    }
}
