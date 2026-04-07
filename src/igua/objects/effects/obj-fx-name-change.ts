import { Graphics, Sprite, TilingSprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";

const [txBack, txDecoration, txCongratulations, txYourNameIs] = Tx.Effects.NameChange.split({ width: 212 });

export function objFxNameChange(name: string) {
    return container()
        .coro(function* (self) {
            const congratulationsObj = Sprite.from(txCongratulations)
                .scaled(2, 2)
                .anchored(0.5, 0.5)
                .show(self);

            yield* Coro.all([
                interpv(congratulationsObj.scale).to(1, 1).over(250),
                interpvr(self).factor(factor.sine).translate(0, -32).over(750),
            ]);

            yield sleep(500);
            congratulationsObj.destroy();

            const backObj = container().show(self);

            Sprite.from(txBack).anchored(0.5, 0.5).mixin(mxnBoilPivot).show(backObj);

            const noiseObj = new TilingSprite(Tx.Effects.Noise256, 210, 48)
                .at(-105, -24)
                .show(backObj);

            noiseObj.alpha = 3 / 255;

            yield sleep(250);

            Sprite.from(txDecoration).anchored(0.5, 0.5).show(backObj);

            yield sleep(250);

            const frontObj = container().at(-106, -25).show(self);

            const maskObj = new Graphics().beginFill(0xffffff).drawRect(15, 15, 182, 20).show(frontObj);
            const maskedObj = container().masked(maskObj).show(frontObj);

            Sprite.from(txYourNameIs).show(maskedObj);
            objText.Large(name, { tint: 0x554BAF })
                .anchored(0.5, 0.5)
                .at(106, 50)
                .show(maskedObj);

            yield sleep(1000);

            yield interpvr(maskedObj).translate(0, -23).over(1000);

            yield sleep(1000);

            yield* Coro.all([
                interpvr(frontObj).translate(0, -280).over(500),
                interpvr(backObj).translate(0, 280).over(333),
            ]);

            self.destroy();
        });
}
