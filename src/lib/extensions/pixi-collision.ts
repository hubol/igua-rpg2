import { DisplayObject } from "pixi.js";
import { Collision, Hitbox } from "../pixi/collision";

declare module "pixi.js" {
    interface DisplayObject {
        hitbox(mode: Hitbox.Default): this;
        hitbox(mode: Hitbox.Scaled, scale: number): this;
        hitbox(mode: Hitbox.Scaled, xscale: number, yscale: number): this;
        hitbox(mode: Hitbox.DisplayObjects, displayObjects: DisplayObject[]): this;
        hitbox(mode: Hitbox.Children): this;

        collides(target: DisplayObject): boolean;
        collidesOne<TDisplayObject extends DisplayObject>(array: TDisplayObject[]): TDisplayObject | null;
        collidesAll<TDisplayObject extends DisplayObject>(array: TDisplayObject[], result?: {}): TDisplayObject[];
    }
}

Object.defineProperties(DisplayObject.prototype, {
    collides: {
        value: function (this: DisplayObject, target: DisplayObject) {
            return Collision.displayObjectCollides(this, target);
        },
        configurable: true,
    },
    collidesOne: {
        value: function (this: DisplayObject, array: DisplayObject[]) {
            return Collision.displayObjectCollidesMany(this, array, 0).instance;
        },
        configurable: true,
    },
    collidesAll: {
        value: function (this: DisplayObject, array: DisplayObject[], result?: {}) {
            return Collision.displayObjectCollidesMany(this, array, 1, result).instances;
        },
        configurable: true,
    },
    hitbox: {
        value: function (this: DisplayObject, hitbox: Hitbox, scale_xscale_displayObjects?: number | DisplayObject[], yscale?: number) {
            Collision.configureDisplayObject(this, hitbox, scale_xscale_displayObjects, yscale);
            return this;
        },
        configurable: true,
    },
});

export default 0;