import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { objAngelEyes } from "./obj-angel-eyes";
import { container } from "../../../lib/pixi/container";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { Integer } from "../../../lib/math/number-alias-types";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";

const [txGear, txGearHighlight] = Tx.Enemy.Suggestive.Gear.split({ count: 2 });
const [txMouth, txMouthAgape] = Tx.Enemy.Suggestive.Mouth.split({ count: 2 });

function objAngelSuggestiveGear(tint: Integer) {
    const ax = 8.5 / 16;
    const ay = 7 / 16;

    const obj = container(
        Sprite.from(txGear).anchored(ax, ay).step(self => {
            self.angle += obj.angleDelta;
        }).tinted(tint),
        Sprite.from(txGearHighlight).anchored(ax, ay),
    ).merge({ angleDelta: 0 });

    return obj;
}

function objAngelSuggestiveGears() {
    const gearObj0 = objAngelSuggestiveGear(0x241DE2).coro(function* (self) {
        while (true) {
            yield sleep(Rng.intc(100, 200));
            self.angleDelta = (Rng.bool() ? 1 : -1) * Rng.intc(2, 4);
            yield sleep(Rng.intc(100, 1000));
            self.angleDelta = 0;
        }
    });
    const gearObj1 = objAngelSuggestiveGear(0x5D9938).step(self => self.angleDelta = -gearObj0.angleDelta);

    return container(
        gearObj0.at(4, 5),
        gearObj1.at(-4, -5),
    );
}

function objAngelSuggestiveFace() {
    const eyesObj = objAngelEyes({
        defaultEyelidRestingPosition: 3,
        eyelidsTint: 0xCE3010,
        gap: 6,
        pupilRestStyle: {
            kind: "cross-eyed",
            offsetFromCenter: 1,
        },
        pupilTx: Tx.Enemy.Suggestive.Pupil,
        scleraTx: Tx.Enemy.Suggestive.Sclera,
        sclerasMirrored: true,
    });

    let agape = false;

    const mouthObj = Sprite.from(txMouth).anchored(0.5, 0.5).at(0, 9).merge({
        get agape() {
            return agape;
        },
        set agape(value) {
            agape = value;
            mouthObj.texture = value ? txMouthAgape : txMouth;
        },
    });

    const spr = Sprite.from(Tx.Enemy.Suggestive.Face).tinted(0xCEBD00).anchored(0.5, 0.5);

    return container(spr, eyesObj, mouthObj);
}

export function objAngelSuggestive() {
    const faceObj = objAngelSuggestiveFace();

    const irregularShadowObj = Sprite.from(Tx.Light.ShadowIrregularSmallRound).anchored(0.5, 0.5).tinted(0x880D17).at(
        27,
        1,
    )
        .mixin(mxnBoilMirrorRotate);

    return container(
        Sprite.from(Tx.Enemy.Suggestive.Body).anchored(0.5, 0.7),
        faceObj,
        irregularShadowObj,
        objAngelSuggestiveGears().at(24, -5),
    );
}
