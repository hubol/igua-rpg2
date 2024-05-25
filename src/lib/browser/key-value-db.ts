import { SubsystemLogger } from "../subsystem-logger";

const StoreName = 'entries';
const KeyPath = 'key';
const ValuePath = 'value';

export class KeyValueDb<TValue> {
    private constructor(private readonly _db: IDBDatabase) {

    }

    private _createTransactionObjectStore(mode: IDBTransactionMode) {
        const transaction = this._db.transaction(StoreName, mode);
        return transaction.objectStore(StoreName);
    }

    set(key: string, value: TValue) {
        const objectStore = this._createTransactionObjectStore('readwrite');
        return new Promise<void>((resolve, reject) => {
            const objectStoreRequest = objectStore.put({ [KeyPath]: key, [ValuePath]: value });
            objectStoreRequest.onsuccess = () => resolve();
            objectStoreRequest.onerror = () => reject(objectStoreRequest.error);
        });
    }

    get(key: string) {
        const objectStore = this._createTransactionObjectStore('readonly');
        return new Promise<TValue | undefined>((resolve, reject) => {
            const objectStoreRequest = objectStore.get(key);
            objectStoreRequest.onsuccess = () => resolve(objectStoreRequest.result?.value);
            objectStoreRequest.onerror = () => reject(objectStoreRequest.error);
        });
    }

    // toArray() {
    //     const objectStore = this._createTransactionObjectStore('readonly');
    //     return new Promise<TValue[]>((resolve, reject) => {
    //         const objectStoreRequest = objectStore.getAll();
    //         objectStoreRequest.onsuccess = () => {
    //             const result: TValue[] = [];
    //             const values = objectStoreRequest.result.values();
    //             for (const value of values) {
    //                 result.push(value[ValuePath]);
    //             }
    //             resolve(result);
    //         };
    //         objectStoreRequest.onerror = () => reject(objectStoreRequest.error);
    //     });
    // }

    static async open<TItem>(name: string) {
        const logger = new SubsystemLogger(`KeyValueDb [${name}]`);

        logger.log(`Opening IndexedDB...`);

        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const openRequest = window.indexedDB.open(name, 1);
            openRequest.onerror = () => reject(openRequest.error);
            openRequest.onsuccess = () => resolve(openRequest.result);
            openRequest.onupgradeneeded = (event: any) => {
                const db: IDBDatabase = event.target.result;

                if (!db.objectStoreNames.contains(StoreName)) {
                    logger.log(`No [${StoreName}] objectStore detected, creating...`);
                    db.createObjectStore(StoreName, { keyPath: KeyPath });
                }
            };
        });

        logger.log(`Opened!`);

        return new KeyValueDb<TItem>(db);
    }
}