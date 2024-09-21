import { BitmapText, ObservablePoint, Sprite } from "pixi.js";
import { VectorSimple } from "../math/vector-type";

interface Anchorable {
    anchored(vector: VectorSimple): this;
    anchored(x: number, y: number): this;
}

declare module "pixi.js" {
    interface Sprite extends Anchorable {}
    interface BitmapText extends Anchorable {}
}

for (const proto of [BitmapText.prototype, Sprite.prototype]) {
    Object.defineProperties(proto, {
        anchored: {
            value: function (this: { anchor: ObservablePoint }, x_vector: VectorSimple | number, y: number) {
                if (typeof x_vector === "number") {
                    this.anchor.x = x_vector;
                    this.anchor.y = y;
                }
                else {
                    this.anchor.x = x_vector.x;
                    this.anchor.y = x_vector.y;
                }
                return this;
            },
            configurable: true,
        },
    });
}
