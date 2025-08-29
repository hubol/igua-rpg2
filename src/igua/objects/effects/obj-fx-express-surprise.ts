import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Effects.ExpressSurprise.split({ width: 64 });

export function objFxExpressSurprise() {
    return objIndexedSprite(txs)
        .anchored(0.5, 0.5)
        .coro(function* (self) {
            yield* Coro.all([
                interp(self, "textureIndex").to(1).over(150),
                interpvr(self).factor(factor.sine).translate(0, -16).over(150),
            ]);

            yield* Coro.all([
                interp(self, "textureIndex").to(txs.length).over(500),
                interpvr(self).translate(0, -32).over(500),
            ]);

            self.alpha = 0.5;
            yield sleep(80);
            self.destroy();
        });
}
