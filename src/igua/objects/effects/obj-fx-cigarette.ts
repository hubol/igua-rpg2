import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { approachLinear } from "../../../lib/math/number";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";

export function objFxCigarette() {
    const seed = Rng.float(999999);
    let size = 0;

    return container(
        Sprite.from(Tx.Effects.Cigarette),
        new Graphics()
            .at(13, -1)
            .step(gfx => {
                gfx.clear();

                if (!gfx.visible) {
                    size = 0;
                    return;
                }

                size = approachLinear(size, 32, 1);

                gfx
                    .lineStyle(1, 0xA8A8A8, 1)
                    .moveTo(0, 0);

                const t = scene.ticker.ticks;

                let i = 0;
                while (i < size) {
                    i = Math.min(size, i + 4);
                    const x = Math.sin((t * (0.2 + i * 0.05)) / 16 + seed) * (3 + i * 0.2);
                    const y = -(i + Math.cos((t * (0.2 + i * 0.03 + seed % 0.2)) / 18 - seed) * 2);
                    gfx.lineTo(
                        Math.round(x),
                        Math.round(y),
                    );
                }
            }),
    );
}
