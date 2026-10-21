import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Effects.FormativeBlob.split({ width: 70 }).reverse();

export function objFxFormativeBlob() {
    return objIndexedSprite(txs)
        .anchored(0.5, 0.5)
        .coro(function* (self) {
            yield interp(self, "textureIndex").to(txs.length).over(Rng.int(400, 500));
            yield sleep(100);
            yield interp(self, "textureIndex").to(0).over(Rng.int(200, 300));
            self.destroy();
        })
        .mixin(mxnSinePivot)
        .coro(function* (self) {
            while (true) {
                yield onPrimitiveMutate(() => self.effectiveTextureIndex);
                if (Rng.bool()) {
                    self.angle += 90;
                }
            }
        });
}
