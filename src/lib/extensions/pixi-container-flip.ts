import { Container, Rectangle } from "pixi.js";
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
            return flipXY(this, 'x', 'a', sign);
        },
        configurable: true,
    },
    flipV: {
        value: function (this: Container, sign = -1) {
            return flipXY(this, 'y', 'd', sign);
        },
        configurable: true,
    },
})

const r = new Rectangle();
const v1 = vnew();
const v2 = vnew();

function flipXY(c: Container, scaleKey: 'x' | 'y', worldTransformScaleKey: 'a' | 'd', sign: number) {
    const currentSign = Math.sign(c.scale[scaleKey]);
    if (currentSign === 0 || currentSign === sign)
        return c;

    const worldScale = c.worldTransform[worldTransformScaleKey];

    const ogBounds = v1.at(c.getBounds(false, r));
    c.scale[scaleKey] *= -1;
    const bounds = v2.at(c.getBounds(false, r));

    c.pivot.add(bounds.add(ogBounds, -1), sign * worldScale);

    return c;
}
