import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { cyclic } from "../../lib/math/number";
import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng } from "../../lib/math/rng";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { container } from "../../lib/pixi/container";
import { MapRgbFilter } from "../../lib/pixi/filters/map-rgb-filter";

const txs = {
    accessory: {
        front: Tx.Collectibles.Flop.Front.split({ width: 36 }),
        rear: Tx.Collectibles.Flop.Rear.split({ width: 48 }),
    },
    body: Tx.Collectibles.Flop.Body,
    crest: Tx.Collectibles.Flop.Crest.split({ width: 48 }),
    ears: Tx.Collectibles.Flop.Ears.split({ width: 48 }),
    eyes: Tx.Collectibles.Flop.Eyes.split({ width: 34 }),
    feet: Tx.Collectibles.Flop.Feet.split({ width: 36 }),
    mouth: Tx.Collectibles.Flop.Mouth.split({ width: 28 }),
    nose: Tx.Collectibles.Flop.Nose.split({ width: 34 }),
};

export function objFlop(flopDexNumberZeroIndexed: Integer) {
    flopDexNumberZeroIndexed = Math.round(flopDexNumberZeroIndexed) % 1024;
    const args = getArgsFromFlopDexNumber(flopDexNumberZeroIndexed);

    return container(
        ...(args.accessory.rear ? [Sprite.from(args.accessory.rear).at(-7, 7)] : []),
        Sprite.from(txs.body),
        Sprite.from(args.feet).at(-4, 22),
        ...(args.accessory.front ? [Sprite.from(args.accessory.front).at(-4, 14)] : []),
        ...(args.ears ? [Sprite.from(args.ears).at(-10, -24)] : []),
        Sprite.from(args.mouth).at(0, 1),
        ...(args.crest ? [Sprite.from(args.crest).at(-10, -24)] : []),
        Sprite.from(args.eyes).at(-5, -4),
        ...(args.nose ? [Sprite.from(args.nose).at(-5, -3)] : []),
    )
        .pivoted(18, 30)
        .filtered(new MapRgbFilter(args.tint.red, args.tint.green, args.tint.blue));
}

const prng = new PseudoRng();

function getArgsFromFlopDexNumber(flopDexNumber: Integer) {
    const seed = flopDexNumber % 2 === 0
        ? (77_777_777 + flopDexNumber * 9_999_999)
        : (88_888_888 + flopDexNumber * 9_919_191);
    prng.seed = seed;

    const hue0 = prng.int(360);
    const hueDeltaSign = prng.intp();
    const hue1 = cyclic(hue0 + prng.int(30, 120) * hueDeltaSign, 0, 360);
    const hue2 = cyclic(hue1 + prng.int(30, 120) * hueDeltaSign, 0, 360);

    const [hueR, hueG, hueB] = prng.shuffle([hue0, hue1, hue2]);

    const accessory = {
        front: txs.accessory.front[prng.int(-1, txs.accessory.front.length)] ?? null,
        rear: txs.accessory.rear[prng.int(-1, txs.accessory.rear.length)] ?? null,
    };

    const tint = prng.bool()
        ? {
            red: AdjustColor.hsv(hueR, prng.intc(50, 100), prng.intc(80, 100)).toPixi(),
            green: AdjustColor.hsv(hueG, prng.intc(75, 100), prng.intc(50, 100)).toPixi(),
            blue: AdjustColor.hsv(hueB, prng.intc(75, 100), prng.intc(50, 100)).toPixi(),
        }
        : {
            red: AdjustColor.hsv(hueR, prng.intc(75, 100), prng.intc(50, 100)).toPixi(),
            green: AdjustColor.hsv(hueG, prng.intc(50, 100), prng.intc(80, 100)).toPixi(),
            blue: AdjustColor.hsv(hueB, prng.intc(50, 100), prng.intc(80, 100)).toPixi(),
        };

    return {
        accessory,
        crest: prng.item(txs.crest),
        ears: txs.ears[prng.int(-1, txs.ears.length)] ?? null,
        eyes: prng.item(txs.eyes),
        feet: prng.item(txs.feet),
        mouth: prng.item(txs.mouth),
        nose: txs.nose[prng.int(-1, txs.nose.length)] ?? null,
        tint,
    };
}
