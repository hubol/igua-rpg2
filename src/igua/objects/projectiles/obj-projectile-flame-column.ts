import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp, interpc } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { mxnDischargeable } from "../../mixins/mxn-dischargeable";
import { objFxSmoke66Px } from "../effects/obj-fx-smoke-66px";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Effects.FlameColumn94px.split({ width: 22 });

export function objProjectileFlameColumn() {
    let previousEffectiveIndex = -1;

    const spriteObj = objIndexedSprite(txs)
        .anchored(0.5, 90 / 94)
        .step(self => {
            if (self.effectiveTextureIndex === 0) {
                if (scene.ticker.ticks % 3 === 0) {
                    self.pivot.x = Rng.intc(-1, 1);
                }
            }
            else {
                self.pivot.x = 0;
            }
            if (self.effectiveTextureIndex !== previousEffectiveIndex) {
                self.scale.x = Rng.intp();
                previousEffectiveIndex = self.effectiveTextureIndex;
            }
        })
        .tinted(0xf03010);

    const shapeObj = new Graphics().beginFill(0xff0000).drawRect(-8, -32, 16, 32).invisible();

    return container(spriteObj, shapeObj)
        .mixin(mxnDischargeable)
        .collisionShape(CollisionShape.DisplayObjects, [shapeObj])
        .coro(function* (self) {
            yield sleepf(10);
            self.mxnDischargeable.charge();
            self.mxnDischargeable.discharge();
            spriteObj.tinted(0xe05620);
            yield* Coro.all([
                interp(spriteObj, "textureIndex").to(txs.length).over(600),
                interpc(spriteObj, "tint").steps(4).to(0xf0f000).over(600),
            ]);

            objFxSmoke66Px().at(self).add(0, -60).show();
            self.destroy();
        });
}
