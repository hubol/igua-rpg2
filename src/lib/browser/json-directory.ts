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

    async read<T>(path: string): Promise<T | null> {
        try {
            const handle = await getFileHandle(this._handle, path, false);
            const file = await handle.getFile();
            return JSON.parse(await file.text());
        }
        catch (e) {
            if (e instanceof DOMException) {
                if (e.name === 'NotFoundError')
                    return null;
            }
            throw new RethrownError(`Failed to read "${path}" as JSON`, e);
        }
    }

    async write(path: string, value: any) {
        const json = JSON.stringify(value);

        const handle = await getFileHandle(this._handle, path, true);
        const writable = await handle.createWritable();
        try {
            await writable.write(json);
        }
        catch (e) {
            throw new RethrownError(`Failed to write JSON to "${path}"`, e);
        }
        finally {
            await writable.close();
        }
    }

    async tree() {
        return buildDirectoryTree(this._handle);
    }
}

async function getFileHandle(root: FileSystemDirectoryHandle, path: string, create: boolean) {
    if (path.length === 0)
        throw new Error(`Path cannot be empty!`);

    const pathParts = path.split('/');

    let current = root;
    for (let i = 0; i < pathParts.length - 1; i++) {
        const name = pathParts[i];
        current = await root.getDirectoryHandle(name, { create });
    }

    return await current.getFileHandle(pathParts[pathParts.length - 1], { create });
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
