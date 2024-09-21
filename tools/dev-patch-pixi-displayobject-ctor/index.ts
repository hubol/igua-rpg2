// @ts-ignore
import path from "path";
import { Patcher } from "../lib/patcher";

export default function (revert?: string) {
    const patcher = new Patcher({
        name: "PixiJS DisplayObject Stacktrace collection",
        patchedSrc: path.resolve("tools/dev-patch-pixi-displayobject-ctor", "DisplayObject.mjs"),
        unpatchedSrc: path.resolve("tools/dev-patch-pixi-displayobject-ctor", "DisplayObject.source.mjs"),
        dst: "node_modules/@pixi/display/lib/DisplayObject.mjs",
    });

    const patch = revert !== "revert";
    if (patch) {
        patcher.patch();
    }
    else {
        patcher.revert();
    }
}
