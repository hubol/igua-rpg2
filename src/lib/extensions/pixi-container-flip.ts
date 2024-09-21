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
        value: function (this: Container & ContainerPrivate, sign = -1) {
            return flipXY(this, "x", "_flipAdjustedPivotX", "a", sign);
        },
        configurable: true,
    },
    flipV: {
        value: function (this: Container & ContainerPrivate, sign = -1) {
            return flipXY(this, "y", "_flipAdjustedPivotY", "d", sign);
        },
        configurable: true,
    },
});

const r = new Rectangle();
const v1 = vnew();
const v2 = vnew();

interface ContainerPrivate {
    _flipAdjustedPivotX: number;
    _flipAdjustedPivotY: number;
}

function flipXY(
    c: Container & ContainerPrivate,
    scaleKey: "x" | "y",
    adjustedPivotKey: keyof ContainerPrivate,
    worldTransformScaleKey: "a" | "d",
    sign: number,
) {
    const currentSign = Math.sign(c.scale[scaleKey]);
    if (currentSign === 0 || currentSign === sign) {
        return c;
    }

    const worldScale = c.worldTransform[worldTransformScaleKey];

    const ogBounds = v1.at(c.getBounds(false, r));

    const adjusted = c[adjustedPivotKey] ?? 0;
    c.pivot[scaleKey] -= adjusted;

    c.scale[scaleKey] *= -1;
    const bounds = v2.at(c.getBounds(false, r));

    if (worldScale !== 0) {
        const delta = (bounds[scaleKey] - ogBounds[scaleKey]) * sign / worldScale;
        c.pivot[scaleKey] += delta;
        c[adjustedPivotKey] = delta;
    }

    return c;
}
