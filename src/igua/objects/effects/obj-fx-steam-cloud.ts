import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { ZIndex } from "../../core/scene/z-index";

export function objFxSteamCloud() {
    const sprite = Sprite.from(Rng.choose(Tx.Effects.PoisonCloud0, Tx.Effects.PoisonCloud1));
    sprite.alpha = 0;

    return sprite
        .anchored(0.5, 0.5)
        .coro(function* () {
            const total = Rng.intc(2000, 4000);
            yield* Coro.all([
                Coro.chain([
                    interp(sprite, "alpha").steps(4).to(0.5).over(total / 4),
                    sleep(total / 2),
                    interp(sprite, "alpha").steps(4).to(0).over(total / 4),
                ]),
                interpvr(sprite).factor(factor.sine).translate(Rng.vunit().scale(8).vround()).over(total),
            ]);
            sprite.destroy();
        })
        .angled(Rng.int(1) * 180)
        .scaled(Rng.intp(), Rng.intp())
        .tinted(Rng.choose(0xffffff, 0xc2c2c2))
        .zIndexed(ZIndex.TerrainDecals);
}
