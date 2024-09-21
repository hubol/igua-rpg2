import { normalizeWindowsPathSeparator } from "../../tools/lib/normalize-windows-path-separator";

export class ErrorPrinter {
    private constructor() {}

    static toPrintable(error: any) {
        let foundRunTs = false;

        const message = error?.message ?? "<No Message>";
        const stack = normalizeWindowsPathSeparator(error?.stack ?? "<No Stack>")
            .replace(message, "")
            .replace("Error:", "")
            .split("\n")
            .filter(line => !line.includes("test/lib/"))
            .reduce((lines, line) => {
                if (line.includes("run.ts:")) {
                    foundRunTs = true;
                }
                if (!foundRunTs) {
                    lines.push(line);
                }
                return lines;
            }, <string[]> [])
            .map(line => line.trim())
            .join("\n")
            .trim();

        return `${message}
${stack}`;
    }
}
