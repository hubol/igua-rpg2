import { Sprite } from "pixi.js";

declare module "pixi.js" {
    interface Sprite {
        trimmed(): this;
    }
}

Object.defineProperties(Sprite.prototype, {
    trimmed: {
        value: function (this: Sprite) {
            this.texture = this.texture.trimmed;
            return this;
        },
        configurable: true,
    },
});

export default 0;
