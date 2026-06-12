import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { approachLinear, nlerp } from "../../../lib/math/number";
import { Integer, Unit } from "../../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { StepOrder } from "../step-order";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [txBallon, txBallonHighlight, ...txBallonFaces] = Tx.Effects.Ballon.split({ width: 22 });
const txsBallonInflate = Tx.Effects.BallonInflate.split({ width: 22 });

const prng = new PseudoRng();

const maxBallonDrainY = 21;

export function objFxBallon(seed: Integer, inflation: Unit) {
    const tints = objFxBallon.getTints(seed);
    const txFace = prng.choose(...txBallonFaces);
    const flip = prng.intp();
    const offset = prng.intc(-2, 2);

    let life = 1;

    const transparentTint = AdjustColor.hsv(tints.hue, 85, 40).toPixi();
    const highlightTint = tints.hue < 125
        ? AdjustColor.hsv(approachLinear(tints.hue, 60, 36), 100, 100).toPixi()
        : AdjustColor.hsv(tints.hue, 46, 100).toPixi();

    const inflatingObj = objIndexedSprite(txsBallonInflate).tinted(tints.rubber);

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
    }, StepOrder.BeforeCamera);

    const ballonObj = container(
        maskObj,
        transparentObj,
        Sprite.from(txBallon).tinted(tints.rubber).masked(maskObj),
        Sprite.from(txBallonHighlight).tinted(highlightTint).step(self => self.alpha = Math.max(0.3, life)),
        Sprite.from(txFace).tinted(tints.face).flipH(flip).at(offset, Math.abs(offset)),
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
            inflation,
            tint: tints.rubber,
        })
        .step(self => inflatingObj.textureIndex = self.inflation * inflatingObj.textures.length)
        .coro(function* (self) {
            if (self.inflation < 1) {
                yield interp(self, "inflation").to(1).over(250);
            }
            inflatingObj.destroy();
            ballonObj.visible = true;
        });
}

objFxBallon.getTints = function getTints (seed: Integer) {
    prng.seed = seed;
    const hue = prng.float(360);
    return {
        hue,
        rubber: AdjustColor.hsv(hue, 92, 80).toPixi(),
        face: AdjustColor.hsv(hue, 95, 53).toPixi(),
    };
};

export type ObjFxBallon = ReturnType<typeof objFxBallon>;
