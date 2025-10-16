import { Serializer } from "../object/serializer";

// TODO name
export class LocalStorageEntry<T> {
    constructor(readonly key: string, readonly type: LocalStorageEntry.StorageType = "local") {}

    private get _storage() {
        return this.type === "local" ? localStorage : sessionStorage;
    }

    get value(): T | undefined {
        const value = this._storage.getItem(this.key);
        if (value) {
            return Serializer.deserialize(value);
        }
    }

    set value(value: T) {
        this._storage.setItem(this.key, Serializer.serialize(value));
    }

    clear() {
        this._storage.removeItem(this.key);
    }
}

export namespace LocalStorageEntry {
    export type StorageType = "local" | "session";
}
