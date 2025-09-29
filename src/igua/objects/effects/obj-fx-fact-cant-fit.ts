import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { renderer } from "../../current-pixi-renderer";
import { mxnFxTintRotate } from "../../mixins/effects/mxn-fx-tint-rotate";

export function objFxFactCantFit() {
    const mask = new Graphics();

    let line = -1;

    const text = Sprite.from(Tx.Effects.FactCantFit).masked(mask);
    const cursor = Sprite.from(Tx.Effects.FactCantFitCursor).at(16, 48);

    return container(text, cursor, mask)
        .pivoted(24, 56)
        .coro(function* (self) {
            yield sleep(160);
            yield interpvr(cursor).to(-15, 0).over(300);
            yield sleep(200);
            for (let i = 0; i < 3; i++) {
                line = i;
                self.play(Sfx.Collect.FactCantFitScan.rate(0.8, 1.2));
                yield interpvr(cursor).factor(factor.sine).translate(60, 0).over(300);
                yield sleep(100);
                line = i + 0.5;
                if (i < 2) {
                    yield interpvr(cursor).translate(-60, 16).over(150);
                }
            }
            yield sleep(250);
            self.play(Sfx.Collect.FactCantFitChime.rate(0.9, 1.1));
            text.mixin(mxnFxTintRotate, 5);
            yield sleep(1000);
            self.play(Sfx.Collect.FactCantFitAway.rate(0.9, 1.1));
            text.mask = null;
            mask.visible = false;
            yield* Coro.all([
                interpvr(text).translate(0, -renderer.height).over(400),
                interpvr(cursor).translate(0, renderer.height).over(400),
            ]);
            self.destroy();
        })
        .step(() => {
            mask.clear().beginFill(0xff0000);

            for (let i = 0; i <= line; i++) {
                const w = Math.ceil(line) > i ? 48 : Math.max(0, cursor.x);
                mask.drawRect(0, i * 16, w, 16);
            }
        });
}
