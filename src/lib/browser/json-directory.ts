import { RethrownError } from "../rethrown-error";
import { KeyValueDb } from "./key-value-db";

export class JsonDirectory {
    private constructor(private readonly _handle: FileSystemDirectoryHandle) {

    }

    static async create(name: string) {
        const db = await FsDirectoryHandles.getDb();

        const key = `JsonDirectory.${name}`;

        const handle = (await db.get(key)) ?? await showDirectoryPicker({ mode: 'readwrite' });

        const state = await handle.queryPermission({ mode: 'readwrite' });

        if (state === 'prompt') {
            const requestedState = await handle.requestPermission({ mode: 'readwrite' });
            if (requestedState !== 'granted')
                throw new Error(`JsonDirectory [${name}]: Did not get [readwrite] permission for FileSystemDirectoryHandle [${handle.name}]`);
        }

        await db.set(key, handle);

        return new JsonDirectory(handle);
    }

    async read<T>(name: string): Promise<T | null> {
        try {
            const handle = await this._handle.getFileHandle(name);
            const file = await handle.getFile();
            return JSON.parse(await file.text());
        }
        catch (e) {
            if (e instanceof DOMException) {
                if (e.name === 'NotFoundError')
                    return null;
            }
            throw new RethrownError(`Failed to read "${name}" as JSON`, e);
        }
    }

    async write(name: string, value: any) {
        const json = JSON.stringify(value);

        const handle = await this._handle.getFileHandle(name, { create: true });
        const writable = await handle.createWritable();
        try {
            await writable.write(json);
        }
        catch (e) {
            throw new RethrownError(`Failed to write JSON to "${name}"`, e);
        }
        finally {
            await writable.close();
        }
    }

    async list() {
        const entries = this._handle.entries();
        for await (const entry of entries) {
            // TODO
            console.log(entry);
        }
    }
}

class FsDirectoryHandles {
    private constructor() {}

    private static _db?: KeyValueDb<FileSystemDirectoryHandle>;

    static async getDb() {
        if (!FsDirectoryHandles._db) {
            FsDirectoryHandles._db = await KeyValueDb.open('FileSystemDirectoryHandles');
        }

        return FsDirectoryHandles._db!;
    }
}
