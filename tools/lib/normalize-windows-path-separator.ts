const windowsPathSeparatorRegExp = /\\/g;

export function normalizeWindowsPathSeparator(path: string) {
    return path.replace(windowsPathSeparatorRegExp, "/");
}
