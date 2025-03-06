import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { approachLinear, nlerp } from "../../../lib/math/number";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [txBallon, txBallonHighlight, ...txBallonFaces] = Tx.Effects.Ballon.split({ width: 22 });
const txsBallonInflate = Tx.Effects.BallonInflate.split({ width: 22 });

const prng = new PseudoRng();

const maxBallonDrainY = 21;

export function objFxBallon(seed = Rng.intc(8_000_000, 24_000_000)) {
    prng.seed = seed;
    const txFace = prng.choose(...txBallonFaces);
    const hue = prng.float(360);
    const flip = prng.intp();
    const offset = prng.intc(-2, 2);

    let life = 1;

    const tint = AdjustColor.hsv(hue, 92, 80).toPixi();
    const transparentTint = AdjustColor.hsv(hue, 85, 40).toPixi();
    const highlightTint = hue < 125
        ? AdjustColor.hsv(approachLinear(hue, 60, 36), 100, 100).toPixi()
        : AdjustColor.hsv(hue, 46, 100).toPixi();
    const faceTint = AdjustColor.hsv(hue, 95, 53).toPixi();

    const inflatingObj = objIndexedSprite(txsBallonInflate).tinted(tint);

    const transparentObj = Sprite.from(txBallon).tinted(transparentTint);
    transparentObj.alpha = 0.5;

    const maskObj = new Graphics().beginFill(0xffffff).drawRect(0, 0, 22, 24).step(self => {
        if (life >= 1) {
            self.y = 0;
        }
        else if (life > 0) {
            self.y = Math.round(nlerp(maxBallonDrainY - 1, 1, life));
        }
        else {
            self.y = maxBallonDrainY;
        }
    });

    const ballonObj = container(
        maskObj,
        transparentObj,
        Sprite.from(txBallon).tinted(tint).masked(maskObj),
        Sprite.from(txBallonHighlight).tinted(highlightTint).step(self => self.alpha = Math.max(0.3, life)),
        Sprite.from(txFace).tinted(faceTint).flipH(flip).at(offset, Math.abs(offset)),
    )
        .invisible();

    return container(inflatingObj, ballonObj).pivoted(10, 23)
        .merge({
            get life() {
                return life;
            },
            set life(value) {
                life = value;
            },
            inflation: 0,
        })
        .step(self => inflatingObj.textureIndex = self.inflation * inflatingObj.textures.length)
        .coro(function* (self) {
            yield interp(self, "inflation").to(1).over(250);
            inflatingObj.destroy();
            ballonObj.visible = true;
        });
}

export type ObjFxBallon = ReturnType<typeof objFxBallon>;
