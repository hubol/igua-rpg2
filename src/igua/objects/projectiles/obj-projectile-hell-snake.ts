import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDischargeable } from "../../mixins/mxn-dischargeable";

const [txNoggin, txEye, txTeethLeft, txTeethRight, txTeethMask] = Tx.Enemy.Miffed.HellSnake.split({ width: 194 });

// TODO timeScale really feels like it should be a feature of dischargeable...
export function objProjectileHellSnake(timeScale = 1) {
    return objPuppetHellSnake()
        .pivoted(97, 108)
        .mixin(mxnDischargeable)
        .coro(function* (self) {
            self.alpha = 0;
            self.y += 128;
            yield interp(self, "alpha").steps(3).to(1).over(200 * timeScale);
            self.play(Sfx.Enemy.Miffed.SnakeAppear.rate(0.6, 0.8));
            yield interpvr(self).factor(factor.sine).translate(0, -128).over(1000 * timeScale);
            self.play(Sfx.Enemy.Miffed.SnakeTeeth0.rate(0.9, 1.1));
            yield interp(self.objPuppetHellSnake, "leftTeethExposedUnit").to(1).over(400 * timeScale);
            self.play(Sfx.Enemy.Miffed.SnakeTeeth1.rate(0.9, 1.1));
            yield interp(self.objPuppetHellSnake, "rightTeethExposedUnit").to(1).over(400 * timeScale);
            self.mxnDischargeable.charge();
            const twitchObj = container()
                .coro(function* () {
                    for (let i = 1;; i++) {
                        self.play(Sfx.Enemy.Miffed.SnakeTwitch.rate(Math.min(1.8, 0.5 + i * 0.1) + Rng.float(0.2)));
                        const f = Math.min(4, Math.ceil(i / 20));
                        const x = self.x + (i % 2 === 0 ? f : -f);
                        const ms = (Math.max(5, 10 - i * 0.5)) * 17;
                        yield interp(self, "x").to(x).over(ms);
                    }
                })
                .show(self);
            yield () => self.mxnDischargeable.isDischarged;
            self.play(Sfx.Enemy.Miffed.SnakeRelease.rate(0.99, 1.01));
            twitchObj.destroy();
            yield interpvr(self).factor(factor.sine).translate(0, -1000).over(1000);
            yield interp(self, "alpha").steps(3).to(0).over(200);
            self.destroy();
        });
}

function objPuppetHellSnake() {
    const api = {
        leftTeethExposedUnit: 0,
        rightTeethExposedUnit: 0,
    };

    const maskObj = Sprite.from(txTeethMask);

    const collisionObj = new Graphics().beginFill(0xff0000).drawRect(20, 13, 154, 93).invisible();

    return container(
        collisionObj,
        new Graphics()
            .at(62, 128 - 35)
            .beginFill(0xD50000)
            .drawRoundedRect(0, 0, 70, 500, 70),
        maskObj,
        Sprite.from(txNoggin),
        Sprite.from(txEye).mixin(mxnBoilPivot),
        container(
            Sprite.from(txTeethLeft)
                .step(self => self.position.at(-30, 30).scale(1 - api.leftTeethExposedUnit)),
            Sprite.from(txTeethRight)
                .step(self => self.position.at(30, 30).scale(1 - api.rightTeethExposedUnit)),
        )
            .masked(maskObj),
    )
        .collisionShape(CollisionShape.DisplayObjects, [collisionObj])
        .merge({ objPuppetHellSnake: api });
}
