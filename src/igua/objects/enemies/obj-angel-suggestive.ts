import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear, nlerp } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { scene } from "../../globals";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { mxnStopAndDieWhenHitGround } from "../../mixins/mxn-stop-and-die-when-hit-ground";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { RpgStatus } from "../../rpg/rpg-status";
import { playerObj } from "../obj-player";
import { objPocketableItem } from "../obj-pocketable-item";
import { objSpikedCanonball } from "../projectiles/obj-spiked-canonball";
import { objAngelEyes, ObjAngelEyesArgs } from "./obj-angel-eyes";
import { objAngelPlantLegs } from "./obj-angel-plant-legs";

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

const commonTheme = {
    eyes: {
        defaultEyelidRestingPosition: 3,
        eyelidsTint: 0xff0000,
        gap: 6,
        pupilRestStyle: {
            kind: "cross-eyed",
            offsetFromCenter: 1,
        },
        pupilTx: Tx.Enemy.Suggestive.Pupil,
        scleraTx: Tx.Enemy.Suggestive.Sclera,
        sclerasMirrored: true,
    } satisfies ObjAngelEyesArgs,
    textures: {
        face: Tx.Enemy.Suggestive.Face,
    },
    positions: {
        eyes: vnew(0, 0),
        face: vnew(0, 0),
        mouth: vnew(0, 9),
    },
    tints: {
        gear0: 0x0000ff,
        gear1: 0x00ff00,
        pupilLeft: 0x000080,
        pupilRight: 0x0000a0,
        face: 0xa0ff00,
        mouth: 0x000080,
    },
    map: {
        red: 0xCE3010,
        green: 0x5D9938,
        blue: 0x241DE2,
        white: 0xffffff,
    },
};

type Theme = typeof commonTheme;

const themes = {
    Common: commonTheme,
    Freakish: {
        ...commonTheme,
        eyes: {
            ...commonTheme.eyes,
            defaultEyelidRestingPosition: 2,
            pupilRestStyle: {
                kind: "cross-eyed",
                offsetFromCenter: 5,
            },
            scleraTx: Tx.Enemy.Suggestive.ScleraWide,
        },
        positions: {
            eyes: vnew(0, -3 + 8),
            face: vnew(0, -3 + 8),
            mouth: vnew(0, 1 + 8),
        },
        textures: {
            face: Tx.Enemy.Suggestive.FaceWide,
        },
        tints: {
            ...commonTheme.tints,
            face: 0xa000ff,
        },
        map: {
            red: 0x208525,
            green: 0xffc21c,
            blue: 0x5D9938,
            white: 0xffffff,
        },
    },
} satisfies Record<string, Theme>;

const ranks = {
    level0: RpgEnemyRank.create({
        loot: {
            valuables: {
                max: 8,
                min: 2,
                deltaPride: -3,
            },
        },
    }),
    level1: RpgEnemyRank.create({
        status: {
            healthMax: 40,
        },
        loot: {
            valuables: {
                max: 8,
                min: 2,
                deltaPride: -3,
            },
        },
    }),
};

const variants = {
    level0: {
        theme: themes.Common,
        rank: ranks.level0,
    },
    level1: {
        theme: themes.Freakish,
        rank: ranks.level1,
    },
};

type VariantKey = keyof typeof variants;

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
    const gearObj0 = objAngelSuggestiveGear(theme.tints.gear0).coro(function* (self) {
        while (true) {
            yield sleep(Rng.intc(100, 200));
            self.angleDelta = (Rng.bool() ? 1 : -1) * Rng.intc(2, 4);
            yield sleep(Rng.intc(100, 1000));
            self.angleDelta = 0;
        }
    });
    const gearObj1 = objAngelSuggestiveGear(theme.tints.gear1).step(self => self.angleDelta = -gearObj0.angleDelta);

    return container(
        gearObj0.at(4, 5),
        gearObj1.at(-4, -5),
    );
}

function objAngelSuggestiveFace(theme: Theme) {
    const eyesObj = objAngelEyes(theme.eyes).at(theme.positions.eyes);

    eyesObj.left.pupilSpr.tint = theme.tints.pupilLeft;
    eyesObj.right.pupilSpr.tint = theme.tints.pupilRight;

    let agape = false;
    let agapeUnit = 0;

    const mouthObj = Sprite.from(txMouth).anchored(0.5, 0.5).at(theme.positions.mouth).tinted(theme.tints.mouth).merge({
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

    const spr = Sprite.from(theme.textures.face).at(theme.positions.face).tinted(theme.tints.face).anchored(0.5, 0.5)
        .mixin(
            mxnBoilMirrorRotate,
        );

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

export function objAngelSuggestive(variantKey: VariantKey) {
    const variant = variants[variantKey];
    const theme = variant.theme;

    const faceObj = objAngelSuggestiveFace(theme);

    const irregularShadowObj = Sprite.from(Tx.Light.ShadowIrregularSmallRound).anchored(0.5, 0.5).tinted(0xC00000).at(
        27,
        1,
    )
        .mixin(mxnBoilMirrorRotate);

    const hurtbox0 = new Graphics().beginFill(0).drawRect(-30, -11, 60, 25).invisible();

    const bodyObj = objAngelSuggestiveBody().pivoted(36, 46);

    const healthbarAnchorObj = new Graphics().beginFill(0xff0000).drawRect(-11, -45, 17, 30).invisible();

    const actualHeadObj = container(
        bodyObj,
        faceObj,
        irregularShadowObj,
        objAngelSuggestiveGears(theme).at(24, -5),
        hurtbox0,
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
                yield interp(bodyObj.bulge, "unit").to(1).over(1000);
                yield sleep(500);
                bodyObj.bulge.phase = "bursting";
                bodyObj.bulge.unit = 0;
                yield interp(bodyObj.bulge, "unit").to(1).over(1000);
                yield sleep(500);
                enemyObj.play(Sfx.Enemy.Suggestive.Flick.rate(0.9, 1.1));
                const canonballObj = objAngelSuggestiveSpikedCanonball(enemyObj.status).at(enemyObj).show();
                // TODO I think there should be some kind of "player sight" mixin
                // That could provide this info to enemies!
                canonballObj.speed.x = playerObj.x > enemyObj.x ? 2 : -2;
                canonballObj.speed.y = -8;
                bodyObj.bulge.phase = "recovering";
                bodyObj.bulge.unit = 0;
                yield interp(bodyObj.bulge, "unit").to(1).over(1000);
            }
        });

    const enemyObj = container(
        objAngelPlantLegs({ objToBounce: actualHeadObj }).pivoted(18, -17),
        actualHeadObj,
        healthbarAnchorObj,
    )
        .mixin(mxnEnemy, { rank: variant.rank, hurtboxes: [hurtbox0], healthbarAnchorObj })
        .filtered(new MapRgbFilter(theme.map.red, theme.map.green, theme.map.blue, theme.map.white))
        // TODO part of loot!!
        .handles("mxnEnemy.died", () => objPocketableItem.parachuting("ComputerChip").at(enemyObj).show());

    return enemyObj;
}

const atkAngelSuggestiveSpikedCanonball = RpgAttack.create({
    physical: 30,
});

function objAngelSuggestiveSpikedCanonball(status: RpgStatus.Model) {
    return objSpikedCanonball()
        .mixin(mxnRpgAttack, { attack: atkAngelSuggestiveSpikedCanonball, attacker: status })
        .mixin(mxnStopAndDieWhenHitGround);
}
