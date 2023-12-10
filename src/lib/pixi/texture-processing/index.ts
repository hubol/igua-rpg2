import { Texture } from "pixi.js";
import { Boundaries } from "../../math/boundaries";

type SplitArgs = { count: number, width?: number } | { count?: number, width: number };

interface ITextureProcessing {
    toRgbaArray(texture: Texture): Uint8ClampedArray;
    getOpaquePixelsBoundaries(texture: Texture): Boundaries | undefined;
    split(texture: Texture, args: SplitArgs): Texture[];
    trimFrame(texture: Texture): Texture;
}

export const TextureProcessing: ITextureProcessing = {} as any;

require("./to-rgba-array");
require("./get-opaque-pixels-boundaries");
require("./split");
require("./trim-frame");