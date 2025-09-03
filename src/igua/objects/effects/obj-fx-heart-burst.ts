import { Tx } from "../../../assets/textures";
import { interp, interpc } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { mxnMotion } from "../../mixins/mxn-motion";
import { objDieOnEmpty } from "../utils/obj-die-on-empty";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { FxPattern } from "./lib/fx-pattern";

const txsHeart = Tx.Effects.HeartBurst16px.split({ width: 16 });

export function objFxHeartBurst() {
    return objIndexedSprite(txsHeart)
        .anchored(0.5, 0.5)
        .flipH(Rng.intp())
        .mixin(mxnMotion)
        .step(self => {
            self.speed.x += Math.sign(self.speed.x) * -0.03;
        })
        .coro(function* (self) {
            yield interp(self.speed, "y").to(-0.4).over(Rng.intc(500, 1000));
        })
        .coro(function* (self) {
            yield interp(self, "textureIndex").to(2).over(Rng.intc(200, 400));
            yield interp(self, "textureIndex").to(txsHeart.length).over(Rng.intc(700, 1000));
            self.destroy();
        })
        .coro(function* (self) {
            self.tint = 0x661312;
            yield interpc(self, "tint").steps(Rng.intc(2, 4)).to(0xCC3720).over(Rng.intc(300, 600));
        });
}

objFxHeartBurst.many = function (radius: Integer, count: Integer) {
    return objDieOnEmpty()
        .coro(function* (self) {
            for (const { position, normal } of FxPattern.getRadialBurst({ count, radius0: radius })) {
                objFxHeartBurst().at(position).show(self).speed.at(normal);
                yield sleepf(1);
            }
        });
};
