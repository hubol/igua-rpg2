import { DisplayObject } from "pixi.js";
import { Collision, CollisionShape } from "../pixi/collision";

declare module "pixi.js" {
    interface DisplayObject {
        collisionShape(shape: CollisionShape.Default): this;
        collisionShape(shape: CollisionShape.Scaled, scale: number): this;
        collisionShape(shape: CollisionShape.Scaled, xscale: number, yscale: number): this;
        collisionShape(shape: CollisionShape.DisplayObjects, displayObjects: DisplayObject[]): this;
        collisionShape(shape: CollisionShape.Children): this;

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
    collisionShape: {
        value: function (this: DisplayObject, shape: CollisionShape, scale_xscale_displayObjects?: number | DisplayObject[], yscale?: number) {
            Collision.configureDisplayObject(this, shape, scale_xscale_displayObjects, yscale);
            return this;
        },
        configurable: true,
    },
});

export default 0;