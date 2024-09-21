import { DisplayObject } from "pixi.js";
import { _Internal_Collision, CollisionShape } from "../pixi/collision";
import { Vector, vnew } from "../math/vector-type";

declare module "pixi.js" {
    interface DisplayObject {
        collisionShape(shape: CollisionShape.Default): this;
        collisionShape(shape: CollisionShape.Scaled, scale: number): this;
        collisionShape(shape: CollisionShape.Scaled, xscale: number, yscale: number): this;
        collisionShape(shape: CollisionShape.DisplayObjects, displayObjects: DisplayObject[]): this;
        collisionShape(shape: CollisionShape.Children): this;

        collides(target: DisplayObject, offset?: Vector): boolean;
        collidesOne<TDisplayObject extends DisplayObject>(
            array: TDisplayObject[],
            offset?: Vector,
        ): TDisplayObject | null;
        collidesAll<TDisplayObject extends DisplayObject>(
            array: TDisplayObject[],
            offset?: Vector,
            result?: {},
        ): TDisplayObject[];
    }
}

const vector0 = vnew();

Object.defineProperties(DisplayObject.prototype, {
    collides: {
        value: function (this: DisplayObject, target: DisplayObject, offset = vector0) {
            return _Internal_Collision.displayObjectCollides(this, offset, target);
        },
        configurable: true,
    },
    collidesOne: {
        value: function (this: DisplayObject, array: DisplayObject[], offset = vector0) {
            return _Internal_Collision.displayObjectCollidesMany(this, offset, array, 0).instance;
        },
        configurable: true,
    },
    collidesAll: {
        value: function (this: DisplayObject, array: DisplayObject[], offset = vector0, result?: {}) {
            return _Internal_Collision.displayObjectCollidesMany(this, offset, array, 1, result).instances;
        },
        configurable: true,
    },
    collisionShape: {
        value: function (
            this: DisplayObject,
            shape: CollisionShape,
            scale_xscale_displayObjects?: number | DisplayObject[],
            yscale?: number,
        ) {
            _Internal_Collision.configureDisplayObject(this, shape, scale_xscale_displayObjects, yscale);
            return this;
        },
        configurable: true,
    },
});

export default 0;
