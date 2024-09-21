import { copyFileSync } from "fs";
// @ts-ignore
import path from "path";

export interface PatcherConfig {
    name: string;
    unpatchedSrc: string;
    patchedSrc: string;
    dst: string;
}

export class Patcher {
    constructor(private readonly _config: PatcherConfig) {
    }

    patch() {
        console.log(`Applying patch <${this._config.name}>...`);
        cp(this._config.patchedSrc, this._config.dst);
    }

    revert() {
        console.log(`Reverting patch <${this._config.name}>...`);
        cp(this._config.unpatchedSrc, this._config.dst);
    }
}

function cp(src: string, dst: string) {
    console.log(`${path.basename(src)} -> ${dst}`);
    copyFileSync(src, dst);
}
