import { copyFileSync } from "fs";
import path from "path";

export default function (revert?: string) {
    const patch = revert !== 'revert';
    console.log(patch ? 'Patching...' : 'Reverting patch...');
    cp(patch ? 'DisplayObject.mjs' : 'DisplayObject.source.mjs', 'node_modules/@pixi/display/lib/DisplayObject.mjs');
}

function cp(src: string, dst: string) {
    console.log(`${src} -> ${dst}`);
    copyFileSync(path.resolve('tools/dev-patch-pixi-displayobject-ctor', src), dst);
}