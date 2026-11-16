import { Tx } from "../../../assets/textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txsCandleLights = Tx.Esoteric.MishaBirthdayCandleLight.split({ width: 4 });

export function objFxFlameSmall() {
    return objIndexedSprite(txsCandleLights)
        .anchored(0.5, 1)
        .coro(function* (self) {
            while (true) {
                self.textureIndex = Rng.int(3);
                self.pivot.at(Rng.intc(-1, 1), Rng.intc(-1, 1));
                yield sleepf(Rng.intc(5, 10));
            }
        });
}
