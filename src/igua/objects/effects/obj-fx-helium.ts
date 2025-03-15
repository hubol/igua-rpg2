import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txsHelium = Tx.Effects.Helium.split({ width: 12 });

export function objFxHelium() {
    return objIndexedSprite(txsHelium)
        .anchored(0.5, 0.5)
        .coro(function* (self) {
            const duration = Rng.intc(500, 800);
            yield* Coro.all([
                Coro.chain([
                    interp(self, "textureIndex").to(txsHelium.length).over(duration / 3),
                    sleep(duration / 3),
                    interp(self, "textureIndex").to(0).over(duration / 3),
                ]),
                interpvr(self).factor(factor.sine).translate(Rng.intc(-6, 6), Rng.intc(-16, -40)).over(duration),
            ]);
            self.destroy();
        });
}
