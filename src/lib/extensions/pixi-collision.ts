import { DisplayObject } from "pixi.js";
import { Collideable, Collision, CollisionResult, FindParam } from "../pixi/collision";
import { Hitbox } from "../game-engine/hitbox-mode";

declare module "pixi.js" {
    interface DisplayObject {
        hitbox(mode: Hitbox.Default): this;
        hitbox(mode: Hitbox.Scaled, scale: number): this;
        hitbox(mode: Hitbox.Scaled, xscale: number, yscale: number): this;
        hitbox(mode: Hitbox.DisplayObjects): this;
        hitbox(mode: Hitbox.Children): this;

        collides(target: Collideable): boolean;
        collidesMany<TCollideable extends Collideable>(array: TCollideable[], param?: FindParam, result?: {}): CollisionResult<TCollideable>;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    collides: {
        value: function (this: DisplayObject, target: Collideable) {
            return Collision.displayObjectCollides(this, target);
        },
        configurable: true,
    },
    collidesMany: {
        value: function (this: DisplayObject, array: Collideable[], param?: FindParam, result?: {}) {
            return Collision.displayObjectCollidesMany(this, array, param ?? FindParam.One, result);
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