import { readFile, writeFile } from "fs/promises";
import path from "path";

export default async function (labelFile: string) {
    const sourceFile = path.resolve("./raw/labels", path.parse(labelFile).name + ".txt");
    const destFile = path.resolve("./raw/labels", path.parse(labelFile).name + ".json");

    const sourceText = (await readFile(sourceFile)).toString();

    const processedLines = sourceText.split("\n")
        .flatMap(line => {
            const trimmed = line.trim();
            if (!trimmed) {
                return [];
            }
            const [start, end, message] = trimmed.split("\t");
            const [command, data = null] = message.split(":");
            return [{ start: Number(start), end: Number(end), command, data }];
        })
        .sort((a, b) => a.start - b.start)
        .map(({ start, end, command, data }) =>
            `[${start}, ${end}, ${JSON.stringify(command)}, ${JSON.stringify(data)}]`
        )
        .join(",\n");

    const processedText = `[
${processedLines}
]`;

    await writeFile(destFile, processedText);

    console.log(sourceFile, "->", destFile);
}
