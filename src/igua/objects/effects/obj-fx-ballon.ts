import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpr } from "../../../lib/game-engine/routines/interp";
import { approachLinear } from "../../../lib/math/number";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [txBallon, txBallonHighlight, ...txBallonFaces] = Tx.Effects.Ballon.split({ width: 22 });
const txsBallonInflate = Tx.Effects.BallonInflate.split({ width: 22 });

const prng = new PseudoRng();

export function objFxBallon(seed = Rng.intc(8_000_000, 24_000_000)) {
    prng.seed = seed;
    const txFace = prng.choose(...txBallonFaces);
    const hue = prng.float(360);
    const flip = prng.intp();
    const offset = prng.intc(-2, 2);

    const tint = AdjustColor.hsv(hue, 92, 80).toPixi();
    const highlightTint = hue < 125
        ? AdjustColor.hsv(approachLinear(hue, 60, 36), 100, 100).toPixi()
        : AdjustColor.hsv(hue, 46, 100).toPixi();
    const faceTint = AdjustColor.hsv(hue, 95, 53).toPixi();

    const inflatingObj = objIndexedSprite(txsBallonInflate).tinted(tint);

    const ballonObj = container(
        Sprite.from(txBallon).tinted(tint),
        Sprite.from(txBallonHighlight).tinted(highlightTint),
        Sprite.from(txFace).tinted(faceTint).flipH(flip).at(offset, Math.abs(offset)),
    )
        .invisible();

    return container(inflatingObj, ballonObj)
        .coro(function* () {
            yield interp(inflatingObj, "textureIndex").to(inflatingObj.textures.length).over(250);
            inflatingObj.destroy();
            ballonObj.visible = true;
        });
}
