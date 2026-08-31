import { DisplayObject, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { ZIndex } from "../../core/scene/z-index";
import { FxPattern } from "../../objects/effects/lib/fx-pattern";
import { objFxAsterisk16Px } from "../../objects/effects/obj-fx-asterisk-16px";
import { playerObj } from "../../objects/obj-player";
import { StepOrder } from "../../objects/step-order";
import { mxnMotion } from "../mxn-motion";

export function mxnEsotericBreakGlassAndSeek(obj: DisplayObject, seekPlayerOffset: VectorSimple) {
    const seekPosition = vnew();

    return obj
        .zIndexed(ZIndex.FrontDecals)
        .coro(function* (self) {
            const glassObj = Sprite.from(Tx.Esoteric.BreakableGlass40px)
                .anchored(0.5, 0.5)
                .at(self.getWorldCenter())
                .zIndexed(ZIndex.FrontDecals)
                .show();

            yield () => playerObj.collides(glassObj);

            // TODO glass break sfx
            for (const { position, normal } of FxPattern.getRadialBurst({ count: 10, radius: [15, 21] })) {
                objFxAsterisk16Px()
                    .mixin(mxnMotion)
                    .step(self => self.speed.scale(0.97))
                    .at(glassObj)
                    .add(position)
                    .show()
                    .speed.at(normal, Rng.float(1.2, 1.9));
            }

            glassObj.destroy();

            for (let i = 0; i < 8; i++) {
                obj.add(Rng.intp(), Rng.intp());
                yield sleep(70);
            }

            obj.step(self => {
                seekPosition.at(playerObj).add(seekPlayerOffset);
                self.moveTowards(seekPosition, 2);
            }, StepOrder.AfterPhysics);
        });
}
