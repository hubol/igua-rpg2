import { Texture } from "pixi.js";
import { TextureProcessing } from "../pixi/texture-processing";

declare module "pixi.js" {
    interface Texture {
        id?: string;

        getId(): string;

        split(args: TextureProcessing.SplitArgs): Texture[];
        readonly trimmed: Texture;
    }
}

interface TexturePrivate {
    _trimmedTexture?: Texture;
}

Object.defineProperties(Texture.prototype, {
    getId: {
        value: function (this: Texture) {
            return this.id ?? "<No Id>";
        },
        configurable: true,
    },
    split: {
        value: function (this: Texture, args: TextureProcessing.SplitArgs) {
            return TextureProcessing.split(this, args);
        },
        configurable: true,
    },
    trimmed: {
        get: function (this: Texture & TexturePrivate) {
            if (!this._trimmedTexture) {
                const texture = new Texture(
                    this.baseTexture,
                    this.frame,
                    this.orig,
                    this.trim,
                    this.rotate,
                    this.defaultAnchor,
                    this.defaultBorders,
                );
                texture.id = this.getId();
                this._trimmedTexture = TextureProcessing.trimFrame(texture);
            }

            return this._trimmedTexture;
        },
        configurable: true,
    },
});
