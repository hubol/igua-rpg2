import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txsSparkle = Tx.Effects.Sparkle40px.split({ width: 40 });
const max = txsSparkle.length - 1;

export function objFxSparkle40Px() {
    return objIndexedSprite(txsSparkle, Rng.int(txsSparkle.length))
        .coro(function* (self) {
            const target0 = Rng.bool() ? max : 0;
            const target1 = target0 === 0 ? max : 0;
            while (true) {
                yield interp(self, "textureIndex").to(target0).over(Rng.int(500, 1000));
                yield sleep(Rng.int(500, 1000));
                yield interp(self, "textureIndex").to(target1).over(Rng.int(500, 1000));
                yield sleep(Rng.int(500, 1000));
            }
        });
}
