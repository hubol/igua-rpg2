import { ColorSource, Graphics, Sprite } from "pixi.js";

declare module "pixi.js" {
    interface Sprite {
        tinted(tint: ColorSource): this;
    }

    interface Graphics {
        tinted(tint: ColorSource): this;
    }
}

const tintedPropertyDescriptorMap: PropertyDescriptorMap = {
    tinted: {
        value: function (this: Graphics | Sprite, tint: ColorSource) {
            this.tint = tint;
            return this;
        },
    },
};

Object.defineProperties(Graphics.prototype, {
    ...tintedPropertyDescriptorMap,
});

Object.defineProperties(Sprite.prototype, {
    ...tintedPropertyDescriptorMap,
});
