import {Rectangle, Texture} from "pixi.js";
import { TextureProcessing } from ".";
import { Empty } from "../../types/empty";

TextureProcessing.split = function (texture, { width, count, trimFrame }) {
    if (!count)
        count = Math.floor(texture.width / width!);
    if (!width)
        width = Math.floor(texture.width / count);

    const textures = Empty<Texture>();
    for (let i = 0; i < count; i += 1) {
        const frame = new Rectangle(texture.frame.x + i * width, texture.frame.y, width, texture.height);
        const subimageTexture = new Texture(texture.baseTexture, frame);
        if (trimFrame)
            TextureProcessing.trimFrame(subimageTexture);
        textures.push(subimageTexture);
    }

    return textures;
}
