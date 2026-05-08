import { DisplayObject } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { mxnFxSpriteGhost } from "../../mixins/effects/mxn-fx-sprite-ghost";
import { mxnDischargeable } from "../../mixins/mxn-dischargeable";
import { StepOrder } from "../step-order";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Effects.EvilSpirit.split({ width: 90 });

export function objProjectileEvilSpirit(targetObj: DisplayObject) {
    const spriteObj = objIndexedSprite(txs)
        .mixin(mxnFxSpriteGhost)
        .anchored(0.5, 1);
    return container(spriteObj)
        .mixin(mxnDischargeable)
        .coro(function* (self) {
            yield interpvr(self).factor(factor.sine).to(getTargetPosition(targetObj)).over(333);
            const moveObj = container()
                .step(() => self.moveTowards(getTargetPosition(targetObj), 16), StepOrder.AfterPhysics)
                .show(self);
            yield interp(spriteObj, "textureIndex").to(3).over(500);
            yield () => self.mxnDischargeable.isCharged;
            moveObj.destroy();
            for (let i = 0; i < 6; i++) {
                self.x += i % 2 === 0 ? 3 : -3;
                yield sleepf(5);
            }
            spriteObj.textureIndex = txs.length - 1;
            spriteObj.flipV();
            yield sleep(150);
            spriteObj.mxnFxSpriteGhost.perFrame = 0.5;
            self.mxnDischargeable.discharge();
            self.step(() => {
                self.y += 8;
                if (self.y >= scene.level.height + 90) {
                    self.destroy();
                }
            });
        });
}

const v = vnew();

function getTargetPosition(targetObj: DisplayObject) {
    return v.at(targetObj.x, targetObj.y - targetObj.getBounds(false).height - 32);
}
