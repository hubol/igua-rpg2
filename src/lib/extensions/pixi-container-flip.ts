import { Container, DisplayObject, Rectangle } from "pixi.js";
import { vnew } from "../math/vector-type";

declare module "pixi.js" {
    interface Container {
        flipH(sign?: number): this;
        flipV(sign?: number): this;
    }
}

Object.defineProperties(Container.prototype, {
    flipH: {
        value: function (this: Container, sign = -1) {
            return flipXY(this, X, sign);
        },
        configurable: true,
    },
    flipV: {
        value: function (this: Container, sign = -1) {
            return flipXY(this, Y, sign);
        },
        configurable: true,
    },
})

const r = new Rectangle();
const v1 = vnew();
const v2 = vnew();

const X = 'x';
const Y = 'y';

function flipXY(sprite: Container, key: 'x' | 'y', sign: number) {
    const currentSign = Math.sign(sprite.scale[key]);
    if (currentSign === 0 || currentSign === sign)
        return sprite;

    const ogBounds = v1.at(sprite.getBounds(false, r));
    sprite.scale[key] *= -1;
    const bounds = v2.at(sprite.getBounds(false, r));
    sprite.pivot.add(bounds.add(ogBounds, -1), sign);

    return sprite;
}
