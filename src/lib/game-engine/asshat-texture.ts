import { BaseTexture, Rectangle, Texture } from "pixi.js";

export class AsshatTexture extends Texture {
    constructor(readonly id: string, baseTexture: BaseTexture, frame: Rectangle) {
        super(baseTexture, frame);
    }
}