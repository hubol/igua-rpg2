import {RenderTexture, Texture} from "pixi.js";
import { TextureProcessing } from ".";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

TextureProcessing.toRgbaArray = function textureToRgbaArray(texture: Texture) {
    if (!canvas) {
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d', { willReadFrequently: true })!;
    }

    if (texture instanceof RenderTexture) {
        throw new Error('textureToRgbaArray does not support RenderTexture');
    }

    // @ts-expect-error
    const image: ImageBitmap | undefined = texture.baseTexture?.resource?.source;
    if (!image || !(image instanceof ImageBitmap))
        throw { message: `Could not convert texture to rgba array!`, texture };

    const w = texture.width;
    const h = texture.height;

    canvas.width = w;
    canvas.height = h;

    const dx = -texture.frame.x;
    const dy = -texture.frame.y;
    context.drawImage(image, dx, dy);

    return context.getImageData(0, 0, w, h).data;
}
