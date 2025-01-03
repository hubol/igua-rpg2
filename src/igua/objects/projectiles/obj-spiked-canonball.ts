import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { CollisionShape } from "../../../lib/pixi/collision";

export function objSpikedCanonball() {
    return Sprite.from(Tx.Enemy.SpikeBall)
        .collisionShape(CollisionShape.Scaled, 0.8)
        .anchored(0.5, 0.5)
        .mixin(mxnPhysics, { gravity: 0.3, physicsRadius: 8 })
        .coro(function* (self) {
            yield () => self.speed.y < 0;
            yield () => self.speed.y > 0;
            const speedX = self.speed.x;
            yield () => self.speed.y === 0;
            // TODO bonk sound effect
            self.speed.y = -2;
            self.speed.x = speedX * 0.3;
        });
}
