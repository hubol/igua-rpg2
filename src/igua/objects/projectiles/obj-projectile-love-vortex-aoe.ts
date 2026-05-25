import { Graphics } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { objFxHeart } from "../effects/obj-fx-heart";
import { objCirclebox } from "../utils/obj-circlebox";

export function objProjectileLoveVortexAoe() {
    const collisionObj = objCirclebox();
    const gfx = new Graphics().beginFill(0xffffff).drawCircle(0, 0, 256).scaled(1 / 256, 1 / 256);

    return container(
        gfx,
        collisionObj,
    )
        .scaled(0, 0)
        .collisionShape(CollisionShape.DisplayObjects, collisionObj.children)
        .coro(function* (self) {
            let iterationsCount = 0;

            while (true) {
                const radius = self.scale.x;
                yield holdf(() => self.scale.x > 0 && self.scale.x >= radius, 15);
                const sfx = Rng.choose(
                    Sfx.Enemy.Boyfriends.LoveVortexActive0,
                    Sfx.Enemy.Boyfriends.LoveVortexActive1,
                    Sfx.Enemy.Boyfriends.LoveVortexActive2,
                );
                self.play(sfx.rate(0.9 + (iterationsCount++) * 0.05));
                objFxHeart.objBurst(self.scale.x, 6).at(self.getWorldCenter()).show();
            }
        });
}
