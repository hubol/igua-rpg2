import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { blendColor } from "../../../lib/color/blend-color";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";

const rng = new PseudoRng();

const shapes = [
    Tx.Shapes.Confetti18x8,
    Tx.Shapes.Confetti32,
    Tx.Shapes.Confetti45deg,
    Tx.Shapes.ConfettiCorner,
    Tx.Shapes.CircleIrregular26,
    Tx.Shapes.DashedLine3px,
    Tx.Shapes.DashedLineArc3px,
    Tx.Shapes.LumpSmall0,
];

const consts = {
    width: 64,
    height: 96,
};

export function objEsotericArt(seed: Integer) {
    rng.seed = seed;

    const palette = range(rng.intc(3, 6)).map(() => rng.color());
    const blendedCount = rng.intc(0, 2);

    function generateSprite() {
        return Sprite.from(rng.item(shapes))
            .anchored(0.5, 0.5)
            .tinted(rng.item(palette))
            .flipH(rng.choose(1, -1))
            .flipV(rng.choose(1, -1))
            .angled(rng.intc(0, 3) * 90)
            .at(rng.intc(consts.width), rng.intc(consts.height));
    }

    for (let i = 0; i < blendedCount; i++) {
        const [firstColor, secondColor] = rng.shuffle(palette);
        const blendedColor = blendColor(firstColor ?? 0, secondColor ?? 0, rng.float(0.4, 0.6));
        palette.push(blendedColor);
    }

    const mask = new Graphics().beginFill(0xffffff).drawRect(0, 0, consts.width, consts.height);

    const obj = container(
        new Graphics().beginFill(rng.item(palette)).drawRect(0, 0, consts.width, consts.height),
        ...range(rng.intc(24, 48)).map(generateSprite),
    );

    return container(obj, mask).masked(mask);
}
