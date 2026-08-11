import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDischargeable } from "../../mixins/mxn-dischargeable";

const [txNoggin, txEye, txTeethLeft, txTeethRight, txTeethMask] = Tx.Enemy.Miffed.HellSnake.split({ width: 194 });

export function objProjectileHellSnake() {
    return objPuppetHellSnake()
        .pivoted(97, 108)
        .mixin(mxnDischargeable)
        .coro(function* (self) {
            self.alpha = 0;
            self.y += 128;
            yield interp(self, "alpha").steps(3).to(1).over(200);
            yield interpvr(self).factor(factor.sine).translate(0, -128).over(1000);
            yield interp(self.objPuppetHellSnake, "leftTeethExposedUnit").to(1).over(400);
            yield interp(self.objPuppetHellSnake, "rightTeethExposedUnit").to(1).over(400);
            self.mxnDischargeable.charge();
            const twitchObj = container()
                .coro(function* () {
                    for (let i = 1;; i++) {
                        const f = Math.min(4, Math.ceil(i / 20));
                        const x = self.x + (i % 2 === 0 ? f : -f);
                        const ms = (Math.max(5, 10 - i * 0.5)) * 17;
                        yield interp(self, "x").to(x).over(ms);
                    }
                })
                .show(self);
            yield () => self.mxnDischargeable.isDischarged;
            twitchObj.destroy();
            yield interpvr(self).factor(factor.sine).translate(0, -1000).over(1000);
        });
}

function objPuppetHellSnake() {
    const api = {
        leftTeethExposedUnit: 0,
        rightTeethExposedUnit: 0,
    };

    const maskObj = Sprite.from(txTeethMask);

    return container(
        new Graphics()
            .at(62, 128 - 35)
            .beginFill(0xD50000)
            .drawRoundedRect(0, 0, 70, 500, 70),
        maskObj,
        Sprite.from(txNoggin),
        Sprite.from(txEye).mixin(mxnBoilPivot),
        container(
            Sprite.from(txTeethLeft)
                .step(self => self.position.at(-40, 40).scale(1 - api.leftTeethExposedUnit)),
            Sprite.from(txTeethRight)
                .step(self => self.position.at(40, 40).scale(1 - api.rightTeethExposedUnit)),
        )
            .masked(maskObj),
    )
        .merge({ objPuppetHellSnake: api });
}
