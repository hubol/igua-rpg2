import { Sprite } from "pixi.js";

export function objSpriteCopy(source: Sprite) {
    const spr = new Sprite(source.texture);
    spr.at(source);
    spr.scale.at(source.scale);
    spr.pivot.at(source.pivot);
    spr.anchor.at(source.anchor);
    return spr;
}
