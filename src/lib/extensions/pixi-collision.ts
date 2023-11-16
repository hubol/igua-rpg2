import { Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import { Collideable, Collision, CollisionResult, FindParam } from "../pixi/collision";

declare module "pixi.js" {
    interface DisplayObject {
        collides(target: Collideable): boolean;
        collidesMany<TCollideable extends Collideable>(array: TCollideable[], result?: {}, param?: FindParam): CollisionResult<TCollideable>;
    }
}

function useDisplayObjectCollision(prototype: any) {
    Object.defineProperties(prototype, {
        collides: {
            value: function (this: DisplayObject, target: Collideable) {
                return Collision.displayObjectCollides(this, target);
            },
            configurable: true,
        },
        collidesMany: {
            value: function (this: DisplayObject, array: Collideable[], result?: {}, param?: FindParam) {
                return Collision.displayObjectCollidesMany(this, array, param ?? FindParam.One, result);
            },
            configurable: true,
        },
    });
}

function useContainerCollision(prototype: any) {
    Object.defineProperties(prototype, {
        collides: {
            value: function (this: Container, target: Collideable) {
                return Collision.containerCollides(this, target);
            },
            configurable: true,
        },
        collidesMany: {
            value: function (this: Container, array: Collideable[], result?: {}, param?: FindParam) {
                return Collision.containerCollidesMany(this, array, param ?? FindParam.One, result);
            },
            configurable: true,
        },
    });
}

useDisplayObjectCollision(DisplayObject.prototype);
useContainerCollision(Container.prototype);
useDisplayObjectCollision(Sprite.prototype);
useDisplayObjectCollision(Graphics.prototype);

export default 0;