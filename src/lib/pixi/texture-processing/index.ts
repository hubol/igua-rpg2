import { Texture } from "pixi.js";
import { Boundaries } from "../../math/boundaries";
import { Vector } from "../../math/vector-type";

export namespace TextureProcessing {
    export type SplitArgs = ({ count: number, width?: number } | { count?: number, width: number })
        & ({ trimFrame?: boolean | { pixelDefaultAnchor: Vector } });

    export let toRgbaArray: (texture: Texture) => Uint8ClampedArray;
    export let getOpaquePixelsBoundaries: (texture: Texture) => Boundaries | undefined;
    export let split: (texture: Texture, args: SplitArgs) => Texture[];
    export let trimFrame: (texture: Texture) => Texture;
}

require("./to-rgba-array");
require("./get-opaque-pixels-boundaries");
require("./split");
require("./trim-frame");