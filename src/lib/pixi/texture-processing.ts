import { BaseTexture, IBaseTextureOptions, Rectangle, RenderTexture, Texture } from "pixi.js";
import { VectorSimple, vnew } from "../math/vector-type";
import { Boundaries } from "../math/boundaries";
import { Empty } from "../types/empty";

const TextureCacheKey_TrimmedFrame = "__trimmedFrame";
const TextureCacheKey_OpaquePixelsBoundaries = "__opaquePixelsBoundaries";

const defaultAnchor = vnew();

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

export namespace TextureProcessing {
    export type SplitArgs =
        & ({ count: number; width?: number } | { count?: number; width: number })
        & ({ trimFrame?: boolean | { pixelDefaultAnchor: VectorSimple } });

    export function split(texture: Texture, { width, count, trimFrame }: SplitArgs) {
        if (!count) {
            count = Math.floor(texture.width / width!);
        }
        if (!width) {
            width = Math.floor(texture.width / count);
        }

        if (typeof trimFrame === "object" && trimFrame.pixelDefaultAnchor) {
            defaultAnchor.at(trimFrame.pixelDefaultAnchor.x / width, trimFrame.pixelDefaultAnchor.y / texture.height);
        }
        else {
            defaultAnchor.at(0, 0);
        }

        const textures = Empty<Texture>();
        for (let i = 0; i < count; i += 1) {
            const frame = new Rectangle(texture.frame.x + i * width, texture.frame.y, width, texture.height);
            const subimageTexture = new Texture(texture.baseTexture, frame);
            subimageTexture.id = texture.getId() + "[" + i + "]";
            if (trimFrame) {
                subimageTexture.defaultAnchor.at(defaultAnchor);
                TextureProcessing.trimFrame(subimageTexture);
            }
            textures.push(subimageTexture);
        }

        return textures;
    }

    export function getOpaquePixelsBoundaries(texture: Texture) {
        const bounds: Boundaries = texture[TextureCacheKey_OpaquePixelsBoundaries];
        if (bounds) {
            return bounds;
        }

        const w = texture.width;
        const h = texture.height;

        let x1 = Number.MAX_VALUE;
        let y1 = Number.MAX_VALUE;
        let x2 = Number.MIN_VALUE;
        let y2 = Number.MIN_VALUE;

        const data = TextureProcessing.toRgbaArray(texture);

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const i = y * w + x;
                const a = data[i * 4 + 3];
                if (a < 1) {
                    continue;
                }
                x1 = Math.min(x1, x);
                y1 = Math.min(y1, y);
                x2 = Math.max(x2, x);
                y2 = Math.max(y2, y);
            }
        }

        if (x1 === 0 && y1 === 0 && x2 === w - 1 && y2 === h - 1) {
            return;
        }

        return texture[TextureCacheKey_OpaquePixelsBoundaries] = { x1, y1, x2, y2 };
    }

    export function toImageData(texture: Texture) {
        if (!canvas) {
            canvas = document.createElement("canvas");
            context = canvas.getContext("2d", { willReadFrequently: true })!;
        }

        if (texture instanceof RenderTexture) {
            throw new Error("textureToRgbaArray does not support RenderTexture");
        }

        // @ts-expect-error
        const image: ImageBitmap | undefined = texture.baseTexture?.resource?.source;
        if (!image || !(image instanceof ImageBitmap)) {
            throw { message: `Could not convert texture to rgba array!`, texture };
        }

        const w = texture.width;
        const h = texture.height;

        canvas.width = w;
        canvas.height = h;

        const dx = -texture.frame.x;
        const dy = -texture.frame.y;
        context.drawImage(image, dx, dy);

        return context.getImageData(0, 0, w, h);
    }

    export function toRgbaArray(texture: Texture) {
        return toImageData(texture).data;
    }

    export async function extractFromAtlas(texture: Texture, options?: IBaseTextureOptions) {
        const data = TextureProcessing.toImageData(texture);
        const bitmap = await createImageBitmap(data);

        const baseTexture = new BaseTexture(bitmap, options);

        const extractedTexture = new Texture(baseTexture);
        extractedTexture.id = texture.getId() + " (Extracted)";

        return extractedTexture;
    }

    export function trimFrame(texture: Texture) {
        if (texture[TextureCacheKey_TrimmedFrame]) {
            throw { message: `Attempting to trim frame of already-trimmed texture`, texture };
        }

        const originalFrame = texture.frame.copyTo(new Rectangle());
        const bounds = TextureProcessing.getOpaquePixelsBoundaries(texture);
        if (!bounds) {
            return texture;
        }
        const { x1, y1, x2, y2 } = bounds;
        const width = x2 - x1 + 1;
        const height = y2 - y1 + 1;
        texture.frame = new Rectangle(originalFrame.x + x1, originalFrame.y + y1, width, height);
        const originalX = Math.round(texture.defaultAnchor.x * originalFrame.width);
        const originalY = Math.round(texture.defaultAnchor.y * originalFrame.height);
        const x = originalX - x1;
        const y = originalY - y1;
        texture.defaultAnchor.set(x / width, y / height);

        texture.id = texture.getId() + " (Trimmed)";

        texture[TextureCacheKey_TrimmedFrame] = true;
        return texture;
    }
}
