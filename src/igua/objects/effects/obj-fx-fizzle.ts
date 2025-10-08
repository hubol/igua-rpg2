import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";

const txs = Tx.Effects.Fizzle.split({ width: 78 });

export function objFxFizzle() {
    return objEphemeralSprite(txs, Rng.float(13, 16) / 60)
        .pivoted(41, 50)
        .scaled(Rng.intp(), 1)
        .coro(function* (self) {
            self.play(Sfx.Effect.Fizzle.rate(0.9, 1.1));
        });
}
