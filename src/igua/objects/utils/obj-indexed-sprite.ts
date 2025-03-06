import { Sprite, Texture } from "pixi.js";

export function objIndexedSprite(textures: Texture[], textureIndex = 0) {
    let effectiveTextureIndex = Math.max(0, Math.min(textures.length - 1, Math.floor(textureIndex)));

    const spr = Sprite.from(textures[effectiveTextureIndex]).merge({
        get effectiveTextureIndex() {
            return effectiveTextureIndex;
        },
        get textures() {
            return textures;
        },
        set textures(value) {
            textures = value;
            this.textureIndex = textureIndex;
        },
        get textureIndex() {
            return textureIndex;
        },
        set textureIndex(value) {
            textureIndex = value;
            effectiveTextureIndex = Math.max(0, Math.min(textures.length - 1, Math.floor(textureIndex)));
            spr.texture = textures[effectiveTextureIndex];
        },
    });
    return spr;
}

export type ObjIndexedSprite = ReturnType<typeof objIndexedSprite>;
