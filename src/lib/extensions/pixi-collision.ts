import { DisplayObject } from "pixi.js";
import { Collideable, Collision, Hitbox } from "../pixi/collision";

declare module "pixi.js" {
    interface DisplayObject {
        hitbox(mode: Hitbox.Default): this;
        hitbox(mode: Hitbox.Scaled, scale: number): this;
        hitbox(mode: Hitbox.Scaled, xscale: number, yscale: number): this;
        hitbox(mode: Hitbox.DisplayObjects, displayObjects: DisplayObject[]): this;
        hitbox(mode: Hitbox.Children): this;

        collides(target: Collideable): boolean;
        collidesOne<TCollideable extends Collideable>(array: TCollideable[]): TCollideable | null;
        collidesAll<TCollideable extends Collideable>(array: TCollideable[], result?: {}): TCollideable[];
    }
}

Object.defineProperties(DisplayObject.prototype, {
    collides: {
        value: function (this: DisplayObject, target: Collideable) {
            return Collision.displayObjectCollides(this, target);
        },
        configurable: true,
    },
    collidesOne: {
        value: function (this: DisplayObject, array: Collideable[]) {
            return Collision.displayObjectCollidesMany(this, array, 0).instance;
        },
        configurable: true,
    },
    collidesAll: {
        value: function (this: DisplayObject, array: Collideable[], result?: {}) {
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