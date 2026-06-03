import { DisplayObject } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { Rng } from "../../../lib/math/rng";
import { objFxHeart } from "../../objects/effects/obj-fx-heart";

export function mxnFxLoveExpand(obj: DisplayObject) {
    return obj
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
