import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { cyclic } from "../../lib/math/number";
import { Integer, PolarInt } from "../../lib/math/number-alias-types";
import { PseudoRng } from "../../lib/math/rng";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { container } from "../../lib/pixi/container";
import { MapRgbFilter } from "../../lib/pixi/filters/map-rgb-filter";
import { objIndexedSprite } from "./utils/obj-indexed-sprite";

const txs = {
    appear: Tx.Collectibles.Flop.Appear.split({ width: 12 }),

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
    flopDexNumberZeroIndexed = cyclic(Math.round(flopDexNumberZeroIndexed), 0, 999);

    const appearObj = objIndexedSprite(txs.appear).anchored(0.5, 0.5);
    const fullyRealizedCharacterObj = objFlopCharacter(flopDexNumberZeroIndexed).invisible();

    const characterObj = container(appearObj, fullyRealizedCharacterObj)
        .filtered(fullyRealizedCharacterObj.objects.filter);

    return container(characterObj)
        .pivoted(0, 17)
        .coro(function* () {
            yield sleep(150);
            appearObj.textureIndex = 1;
            yield sleep(150);
            appearObj.textureIndex = 2;
            yield sleep(150);
            fullyRealizedCharacterObj.scaled(0.5, 0.5).visible = true;
            yield sleep(300);
            fullyRealizedCharacterObj.scaled(1, 1);
        })
        .coro(function* (self) {
            for (let i = 0; i < 8; i++) {
                yield sleep(150);
                characterObj.angle += 90;
            }

            objText.SmallDigits(printFlopDexNumber(flopDexNumberZeroIndexed)).anchored(0.5, 0).at(0, 19).show(
                self,
            );

            Sprite.from(Tx.Ui.NewIndicator).at(12, 16).show(self);
        });
}

function printFlopDexNumber(flopDexNumberZeroIndexed: Integer) {
    let result = "" + (flopDexNumberZeroIndexed + 1);
    while (result.length < 3) {
        result = "0" + result;
    }

    return "#" + result;
}

function objFlopCharacter(flopDexNumberZeroIndexed: Integer) {
    const args = getArgsFromFlopDexNumber(flopDexNumberZeroIndexed);

    const filter = new MapRgbFilter(args.tint.red, args.tint.green, args.tint.blue);

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
        .pivoted(15, 13)
        .merge({ objects: { filter } });
}

const prng = new PseudoRng();

function getArgsFromFlopDexNumber(flopDexNumber: Integer) {
    const seed = flopDexNumber % 2 === 0
        ? (77_777_777 + flopDexNumber * 9_999_999)
        : (88_888_888 + flopDexNumber * 9_919_191);
    prng.seed = seed;

    const hue0 = getHue();
    const hueDeltaSign = prng.intp();
    const hue1 = getNextHue(hue0, hueDeltaSign);
    const hue2 = getNextHue(hue1, hueDeltaSign);

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

function getHue() {
    const range = prng.int(7);

    if (range < 3) {
        return prng.int(70);
    }
    if (range === 3) {
        return prng.int(70, 162);
    }
    return prng.int(162, 360);
}

function getNextHue(hue: number, deltaSign: PolarInt) {
    let min = 20;
    let max = 70;

    if (hue >= 162 && prng.bool()) {
        max += 50;
    }
    else if (hue >= 70 && hue < 162) {
        min = 50;
        max += 50;
    }

    return cyclic(hue + prng.int(min, max) * deltaSign, 0, 360);
}
