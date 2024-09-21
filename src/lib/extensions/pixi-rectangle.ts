import { Rectangle } from "pixi.js";
import { Vector, vnew } from "../math/vector-type";

declare module "pixi.js" {
    interface Rectangle {
        getCenter(): Vector;
    }
}

const v = vnew();

Object.defineProperties(Rectangle.prototype, {
    getCenter: {
        value: function (this: Rectangle) {
            return v.at(this.x + this.width / 2, this.y + this.height / 2);
        },
        configurable: true,
    },
});
