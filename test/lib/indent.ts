const whitespaceCache: Record<number, string> = {};
const lineFeed = /\n/g;

export function indent(string: string, spaces: number) {
    if (!whitespaceCache[spaces]) {
        whitespaceCache[spaces] = "\n" + new Array(spaces + 1).join(" ");
    }
    return string.replace(lineFeed, whitespaceCache[spaces]);
}
