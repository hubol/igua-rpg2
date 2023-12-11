import {Rectangle, Texture} from "pixi.js";
import { TextureProcessing } from ".";
import { Empty } from "../../types/empty";
import { vnew } from "../../math/vector-type";

const defaultAnchor = vnew();

TextureProcessing.split = function (texture, { width, count, trimFrame }) {
    if (!count)
        count = Math.floor(texture.width / width!);
    if (!width)
        width = Math.floor(texture.width / count);

    if (typeof trimFrame === 'object' && trimFrame.pixelDefaultAnchor) {
        defaultAnchor.at(trimFrame.pixelDefaultAnchor.x / width, trimFrame.pixelDefaultAnchor.y / texture.height);
    }
    else
        defaultAnchor.at(0, 0);

    const textures = Empty<Texture>();
    for (let i = 0; i < count; i += 1) {
        const frame = new Rectangle(texture.frame.x + i * width, texture.frame.y, width, texture.height);
        const subimageTexture = new Texture(texture.baseTexture, frame);
        if (trimFrame) {
            subimageTexture.defaultAnchor.at(defaultAnchor);
            TextureProcessing.trimFrame(subimageTexture);
        }
        textures.push(subimageTexture);
    }

    return textures;
}
