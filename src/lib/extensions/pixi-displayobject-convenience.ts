import { DisplayObject } from "pixi.js";
import { DefaultStages } from "../game-engine/default-stages";

declare module "pixi.js" {
    interface DisplayObject {
        show(container?: Container): this;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    show: {
        value: function (this: DisplayObject, container = DefaultStages.show) {
            container.addChild(this);
            return this;
        },
    },
});

export default 0;