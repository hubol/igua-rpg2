// @ts-ignore
import path from "path";
import { Patcher, PatcherConfig } from "../lib/patcher";

const patcherConfigs: PatcherConfig[] = [
    {
        name: "PixiJS BitmapText anchor rounding",
        unpatchedSrc: src("pixijs/BitmapText.source.mjs"),
        patchedSrc: src("pixijs/BitmapText.mjs"),
        dst: "node_modules/@pixi/text-bitmap/lib/BitmapText.mjs",
    },
];

function src(file: string) {
    return path.resolve("tools/patch-dependencies", file);
}

export default function (revert?: string) {
    const patchers = patcherConfigs.map(config => new Patcher(config));

    const patch = revert !== "revert";

    console.log(patch ? "Applying dependency patches..." : "Reverting dependency patches...");
    console.log(patchers.length + " file(s) to copy");

    for (const patcher of patchers) {
        if (patch) {
            patcher.patch();
        }
        else {
            patcher.revert();
        }
    }
}
