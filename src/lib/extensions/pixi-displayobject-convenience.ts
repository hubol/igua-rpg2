import { Container, DisplayObject } from "pixi.js";

declare module "pixi.js" {
    interface DisplayObject {
        show(container: Container): this;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    show: {
        value: function (this: DisplayObject, container: Container) {
            container.addChild(this);
            return this;
        },
    },
});

export default 0;