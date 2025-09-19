import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = Tx.Effects.EighthNote.split({ width: 14 });

export function objFxEighthNote() {
    let steps = 0;
    const m = Rng.float(0.1, 0.3);
    const b = Rng.float(Math.PI * 2);

    return objIndexedSprite(txs)
        .anchored(0.5, 15 / 20)
        .step(self => self.pivot.y = Math.round(Math.sin(m * (steps++) + b) * 2))
        .coro(function* (self) {
            yield interp(self, "textureIndex").to(txs.length).over(250);
            yield sleep(1000);
            yield interp(self, "textureIndex").to(0).over(250);
            self.destroy();
        });
}
