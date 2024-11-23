import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { objAngelEyes } from "./obj-angel-eyes";
import { container } from "../../../lib/pixi/container";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { Integer } from "../../../lib/math/number-alias-types";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { approachLinear, nlerp } from "../../../lib/math/number";
import { scene } from "../../globals";
import { lerp } from "../../../lib/game-engine/routines/lerp";
import { objAngelPlantLegs } from "./obj-angel-plant-legs";

const themes = {
    Common: {
        gear0Tint: 0x241DE2,
        gear1Tint: 0x5D9938,
        pupilLeftTint: 0x000080,
        pupilRightTint: 0x0000a0,
        eyelidsTint: 0xCE3010,
        faceTint: 0xCEBD00,
        mouthTint: 0x000080,
    },
};

type Theme = typeof themes[keyof typeof themes];

const [txGear, txGearHighlight] = Tx.Enemy.Suggestive.Gear.split({ count: 2 });
const [txMouth, txMouthPartiallyAgape, txMouthAgape] = Tx.Enemy.Suggestive.Mouth.split({ count: 3 });
const [
    txBody,
    txBulgeSmall,
    txBulgeMedium,
    txBulgeLarge,
    txBulgeBursting,
    txBulgeSkinny,
    txBulgeSkinnyReducedHighlight,
] = Tx
    .Enemy.Suggestive.Body.split({ count: 7 });

const rnkAngelSuggestive = RpgEnemyRank.create({});

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

function objAngelSuggestiveGears(theme: Theme) {
    const gearObj0 = objAngelSuggestiveGear(theme.gear0Tint).coro(function* (self) {
        while (true) {
            yield sleep(Rng.intc(100, 200));
            self.angleDelta = (Rng.bool() ? 1 : -1) * Rng.intc(2, 4);
            yield sleep(Rng.intc(100, 1000));
            self.angleDelta = 0;
        }
    });
    const gearObj1 = objAngelSuggestiveGear(theme.gear1Tint).step(self => self.angleDelta = -gearObj0.angleDelta);

    return container(
        gearObj0.at(4, 5),
        gearObj1.at(-4, -5),
    );
}

function objAngelSuggestiveFace(theme: Theme) {
    const eyesObj = objAngelEyes({
        defaultEyelidRestingPosition: 3,
        eyelidsTint: theme.eyelidsTint,
        gap: 6,
        pupilRestStyle: {
            kind: "cross-eyed",
            offsetFromCenter: 1,
        },
        pupilTx: Tx.Enemy.Suggestive.Pupil,
        scleraTx: Tx.Enemy.Suggestive.Sclera,
        sclerasMirrored: true,
    });

    eyesObj.left.pupilSpr.tint = theme.pupilLeftTint;
    eyesObj.right.pupilSpr.tint = theme.pupilLeftTint;

    let agape = false;
    let agapeUnit = 0;

    const mouthObj = Sprite.from(txMouth).anchored(0.5, 0.5).at(0, 9).tinted(theme.mouthTint).merge({
        get agape() {
            return agape;
        },
        set agape(value) {
            agape = value;
        },
    })
        .step(() => {
            agapeUnit = approachLinear(agapeUnit, agape ? 1 : 0, 0.2);
            if (agapeUnit === 1) {
                mouthObj.texture = txMouthAgape;
            }
            else if (agapeUnit === 0) {
                mouthObj.texture = txMouth;
            }
            else {
                mouthObj.texture = txMouthPartiallyAgape;
            }
        });

    const spr = Sprite.from(Tx.Enemy.Suggestive.Face).tinted(theme.faceTint).anchored(0.5, 0.5);

    return container(spr, eyesObj, mouthObj).merge({ mouthObj });
}

type BulgePhase = "inflating" | "bursting" | "recovering";

function objAngelSuggestiveBody() {
    const bodySpr = Sprite.from(txBody);
    const bulge = {
        phase: "inflating" as BulgePhase,
        unit: 0,
    };

    const bulgeLeftSpr = Sprite.from(txBulgeLarge).anchored(39 / 72, 29 / 64);
    const bulgeRightSpr = Sprite.from(txBulgeLarge).anchored(39 / 72, 29 / 64);

    const bulgeSpr = Sprite.from(txBulgeSmall)
        .step(() => {
            if (bulge.phase === "inflating") {
                bulgeLeftSpr.visible = false;
                bulgeRightSpr.visible = false;
                bulgeSpr.visible = true;

                bulgeSpr.pivot.x = 0;
                bulgeSpr.pivot.y = 0;

                if (bulge.unit < 0.2) {
                    bulgeSpr.y = Math.round(nlerp(0, -6, bulge.unit / 0.2));
                    bulgeSpr.texture = txBulgeSmall;
                }
                else if (bulge.unit < 0.8) {
                    bulgeSpr.y = Math.round(nlerp(0, -6, (bulge.unit - 0.2) / 0.6));
                    bulgeSpr.texture = txBulgeMedium;
                }
                else {
                    bulgeSpr.y = 0;
                    bulgeSpr.texture = txBulgeLarge;
                }
            }
            else if (bulge.phase === "bursting") {
                bulgeLeftSpr.visible = false;
                bulgeRightSpr.visible = false;
                bulgeSpr.visible = true;

                bulgeSpr.texture = bulge.unit > 0.2 ? txBulgeBursting : txBulgeLarge;
                bulgeSpr.y = 0;
                const fx = bulge.unit > 0.5 ? 4 : 6;
                const fy = bulge.unit > 0.5 ? 3 : 5;

                const f2x = bulge.unit > 0.8 ? 3 : 2;
                const f2y = bulge.unit > 0.9 ? 2 : 1;

                bulgeSpr.pivot.x = Math.round(scene.ticker.ticks / fx) % f2x;
                bulgeSpr.pivot.y = Math.round(scene.ticker.ticks / fy) % f2y;
            }
            else if (bulge.phase === "recovering") {
                bulgeLeftSpr.visible = true;
                bulgeRightSpr.visible = true;
                bulgeSpr.visible = false;

                const tx = bulge.unit > 0.5 ? txBulgeSkinnyReducedHighlight : txBulgeSkinny;
                bulgeLeftSpr.texture = tx;
                bulgeRightSpr.texture = tx;

                if (bulge.unit < 0.2) {
                    const f = bulge.unit / 0.2;
                    bulgeLeftSpr.x = nlerp(-2, -26, f);
                    bulgeRightSpr.x = nlerp(2, 26, f);
                    bulgeLeftSpr.y = f * f * 8;
                    bulgeRightSpr.y = f * f * 8;
                    bulgeLeftSpr.angle = -15;
                    bulgeRightSpr.angle = 30;
                }
                else {
                    const f = (bulge.unit - 0.2) / 0.8;
                    bulgeLeftSpr.x = nlerp(-25, 0, f * f);
                    bulgeRightSpr.x = nlerp(25, 0, f * f);
                    bulgeLeftSpr.y = 8 + f * 8;
                    bulgeRightSpr.y = 8 + f * f * 10;
                    bulgeLeftSpr.angle = (1 - (f * f)) * -15;
                    bulgeRightSpr.angle = (1 - f) * 30;
                }

                bulgeLeftSpr.add(39, 29);
                bulgeRightSpr.add(39, 29);

                bulgeLeftSpr.position.scale(0.5).vround().scale(2);
                bulgeRightSpr.position.scale(0.5).vround().scale(2);
                bulgeLeftSpr.angle = Math.round(bulgeLeftSpr.angle / 5) * 5;
                bulgeRightSpr.angle = Math.round(bulgeRightSpr.angle / 5) * 5;
            }
        });

    return container(bulgeLeftSpr, bulgeRightSpr, bulgeSpr, bodySpr).merge({ bulge });
}

export function objAngelSuggestive() {
    const theme = themes.Common;

    const faceObj = objAngelSuggestiveFace(theme);

    const irregularShadowObj = Sprite.from(Tx.Light.ShadowIrregularSmallRound).anchored(0.5, 0.5).tinted(0x880D17).at(
        27,
        1,
    )
        .mixin(mxnBoilMirrorRotate);

    const hurtbox0 = new Graphics().beginFill(0).drawRect(-30, -11, 60, 25).invisible();
    const hurtbox1 = new Graphics().beginFill(0xff0000).drawRect(-11, -35, 17, 30).invisible();

    const bodyObj = objAngelSuggestiveBody().pivoted(36, 46);

    const actualHeadObj = container(
        bodyObj,
        faceObj,
        irregularShadowObj,
        objAngelSuggestiveGears(theme).at(24, -5),
        hurtbox0,
        hurtbox1,
    )
        .coro(function* () {
            while (true) {
                yield sleep(1000);
                faceObj.mouthObj.agape = !faceObj.mouthObj.agape;
            }
        })
        .coro(function* () {
            while (true) {
                bodyObj.bulge.phase = "inflating";
                bodyObj.bulge.unit = 0;
                yield lerp(bodyObj.bulge, "unit").to(1).over(1000);
                yield sleep(500);
                bodyObj.bulge.phase = "bursting";
                bodyObj.bulge.unit = 0;
                yield lerp(bodyObj.bulge, "unit").to(1).over(1000);
                yield sleep(500);
                bodyObj.bulge.phase = "recovering";
                bodyObj.bulge.unit = 0;
                yield lerp(bodyObj.bulge, "unit").to(1).over(1000);
            }
        });

    return container(
        objAngelPlantLegs({ objToBounce: actualHeadObj }).pivoted(18, -17),
        actualHeadObj,
    )
        .mixin(mxnEnemy, { rank: rnkAngelSuggestive, hurtboxes: [hurtbox0, hurtbox1] });
}