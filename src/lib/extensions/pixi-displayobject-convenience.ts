import { DisplayObject } from "pixi.js";
import { DefaultStages } from "../game-engine/default-stages";
import { Pojo } from "../types/pojo";
import { merge } from "../object/merge";

declare module "pixi.js" {
    interface DisplayObject {
        show(container?: Container): this;
        merge<T extends Pojo>(t: T): this & T;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    show: {
        value: function (this: DisplayObject, container = DefaultStages.show) {
            container.addChild(this);
            return this;
        },
    },
    merge: {
        value: function (this: DisplayObject, pojo: Pojo) {
            return merge(this, pojo);
        }
    },
});

export default 0;