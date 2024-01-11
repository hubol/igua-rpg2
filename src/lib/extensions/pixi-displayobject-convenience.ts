import { DisplayObject, Rectangle } from "pixi.js";
import { DefaultStages } from "../game-engine/default-stages";
import { Pojo } from "../types/pojo";
import { merge } from "../object/merge";

declare module "pixi.js" {
    interface DisplayObject {
        named(name: string): this;
        show(container?: Container): this;
        merge<T extends Pojo>(t: T): this & T;
        getMinY(): number;
        getMaxY(): number;
    }
}

const r = new Rectangle();

Object.defineProperties(DisplayObject.prototype, {
    named: {
        value: function (this: DisplayObject, name: string) {
            this.name = name;
            return this;
        },
    },
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
    getMinY: {
        value: function (this: DisplayObject) {
            return this.getBounds(false, r).y;
        }
    },
    getMaxY: {
        value: function (this: DisplayObject) {
            return this.getBounds(false, r).y + r.height;
        }
    },
});

export default 0;