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

    async tree() {
        return buildDirectoryTree(this._handle);
    }
}

async function buildDirectoryTree(handle: FileSystemDirectoryHandle) {
    const tree: DirectoryTreeDirectoryEntry = { name: handle.name, handle, entries: [] };
    const entries = handle.entries();
    for await (const [ name, handle ] of entries) {
        if (handle instanceof FileSystemFileHandle) {
            tree.entries.push({
                name,
                handle
            });
        }
        else {
            tree.entries.push(await buildDirectoryTree(handle));
        }
    }

    return tree;
}

interface DirectoryTreeFileEntry {
    name: string;
    handle: FileSystemFileHandle;
}

interface DirectoryTreeDirectoryEntry {
    name: string;
    handle: FileSystemDirectoryHandle;
    entries: DirectoryTreeEntry[];
}

type DirectoryTreeEntry = DirectoryTreeFileEntry | DirectoryTreeDirectoryEntry;

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
