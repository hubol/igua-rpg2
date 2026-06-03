import { Container, TilingSprite } from "pixi.js";
import { NoAtlasTx } from "../../../assets/no-atlas-textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { vnew } from "../../../lib/math/vector-type";
import { scene } from "../../globals";
import { StepOrder } from "../../objects/step-order";

export function mxnFxEmo(obj: Container) {
    const offset = vnew();

    new TilingSprite(NoAtlasTx.Enemy.Chill.Aoe, 500, 280)
        .step(self => {
            self.at(scene.camera);
            self.tilePosition.at(scene.camera, -1).add(offset);
            if (obj.destroyed) {
                self.destroy();
            }
        }, StepOrder.Camera)
        .coro(function* () {
            while (true) {
                yield sleepf(5);
                offset.add(1, 1);
            }
        })
        .masked(obj)
        .show();

    return obj;
}
