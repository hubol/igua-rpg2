import { Rectangle } from "pixi.js";
import { TextureProcessing } from ".";

const TextureCacheKey = '__trimmedFrame';

TextureProcessing.trimFrame = function trimFrame(texture) {
    if (texture[TextureCacheKey])
        throw { message: `Attempting to trim frame of already-trimmed texture`, texture };

    const originalFrame = texture.frame.copyTo(new Rectangle());
    const bounds = TextureProcessing.getOpaquePixelsBoundaries(texture);
    if (!bounds)
        return texture;
    const { x1, y1, x2, y2 } = bounds;
    const width = x2 - x1 + 1;
    const height = y2 - y1 + 1;
    texture.frame = new Rectangle(originalFrame.x + x1, originalFrame.y + y1, width, height);
    const originalX = Math.round(texture.defaultAnchor.x * originalFrame.width);
    const originalY = Math.round(texture.defaultAnchor.y * originalFrame.height);
    const x = originalX - x1;
    const y = originalY - y1;
    texture.defaultAnchor.set(x / width, y / height);

    texture[TextureCacheKey] = true;
    return texture;
}