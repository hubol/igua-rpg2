import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { objFxBurst32 } from "../effects/obj-fx-burst-32";

const burstTints = [0x845FD3, 0xBEC71D, 0x5DE478, 0xBC362F];

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
            objFxBurst32().at(self).add(0, 8).tinted(Rng.choose(...burstTints)).show(self.parent);
            self.play(Sfx.Impact.SpikedCanonballLand.rate(0.9, 1.1));
            self.speed.y = -2;
            self.speed.x = speedX * 0.3;
        });
}
