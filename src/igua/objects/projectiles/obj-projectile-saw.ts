import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { objCirclebox } from "../utils/obj-circlebox";

export function objProjectileSaw() {
    const collisionObj = objCirclebox().scaled(52, 52);

    return container(
        Sprite.from(Tx.Enemy.Heatmeat.Saw)
            .anchored(0.5, 0.5),
        collisionObj,
    )
        .collisionShape(CollisionShape.DisplayObjects, [collisionObj]);
}
