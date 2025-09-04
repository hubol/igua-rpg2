import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp, interpc } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Effects.Smoke66px.split({ width: 66 });

export function objFxSmoke66Px() {
    return objIndexedSprite(txs)
        .anchored(0.5, 0.5)
        .mixin(mxnBoilPivot)
        .scaled(Rng.intp(), Rng.intp())
        .tinted(0x909090)
        .coro(function* (self) {
            const duration = Rng.intc(350, 500);

            yield* Coro.all([
                interp(self, "textureIndex").to(txs.length).over(duration),
                interpc(self, "tint").steps(4).to(0x404040).over(duration),
            ]);

            yield sleep(100);

            self.alpha = 0.5;

            yield sleep(100);
            self.destroy();
        });
}
