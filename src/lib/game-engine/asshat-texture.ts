import { BaseTexture, Rectangle, Texture } from "pixi.js";
import { TextureProcessing } from "../pixi/texture-processing";

export class AsshatTexture extends Texture {
    constructor(readonly id: string, baseTexture: BaseTexture, frame: Rectangle) {
        super(baseTexture, frame);
    }

    split(args: TextureProcessing.SplitArgs) {
        return TextureProcessing.split(this, args);
    }
}