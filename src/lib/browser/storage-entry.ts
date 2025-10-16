import { Serializer } from "../object/serializer";

abstract class StorageEntryBase<T> {
    constructor(readonly key: string, private readonly _storage: Storage) {}

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

export namespace StorageEntry {
    export class Local<T> extends StorageEntryBase<T> {
        constructor(key: string) {
            super(key, localStorage);
        }
    }

    export class Session<T> extends StorageEntryBase<T> {
        constructor(key: string) {
            super(key, sessionStorage);
        }
    }
}
