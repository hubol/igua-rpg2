import { Graphics } from "pixi.js";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { objCirclebox } from "../utils/obj-circlebox";

export function objProjectileCircle() {
    const collisionObj = objCirclebox();
    const gfx = new Graphics().beginFill(0xffffff).drawCircle(0, 0, 256).scaled(1 / 256, 1 / 256);

    const api = {
        get tint() {
            return gfx.tint;
        },
        set tint(value) {
            gfx.tint = value;
        },
    };

    return container(
        gfx,
        collisionObj,
    )
        .merge({ objProjectileCircle: api })
        .scaled(0, 0)
        .collisionShape(CollisionShape.DisplayObjects, collisionObj.children);
}
