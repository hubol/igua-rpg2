async function write(path: string, blob: Blob) {
    await fetch("/fs/" + path, { method: "POST", body: blob });
}

export const DevFs = {
    write,
};
