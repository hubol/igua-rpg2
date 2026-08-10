import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Instances } from "../../../lib/game-engine/instances";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interp, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { approachLinear, nlerp } from "../../../lib/math/number";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { StringConvert } from "../../../lib/string/string-convert";
import { ValuesOf } from "../../../lib/types/values-of";
import { ZIndex } from "../../core/scene/z-index";
import { scene } from "../../globals";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";
import { MxnDetectPlayer, mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { MxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { mxnStopAndDieWhenHitGround } from "../../mixins/mxn-stop-and-die-when-hit-ground";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { RpgStatus } from "../../rpg/rpg-status";
import { objFxExpressSurprise } from "../effects/obj-fx-express-surprise";
import { objFxFormativeBurst } from "../effects/obj-fx-formative-burst";
import { objFxRipple } from "../effects/obj-fx-ripple";
import { playerObj } from "../obj-player";
import { objSafeMarker } from "../obj-safe-marker";
import { objProjectileElectricalPulseGround } from "../projectiles/obj-projectile-electrical-pulse-ground";
import { objSpikedCanonball } from "../projectiles/obj-spiked-canonball";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";
import { objAngelPlantLegs } from "./obj-angel-plant-legs";

const [txGear, txGearHighlight] = Tx.Enemy.Suggestive.Gear.split({ count: 2 });
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

const themes = (function () {
    const template = AngelThemeTemplate.create(
        {
            eyes: {
                defaultEyelidRestingPosition: 3,
                eyelidsTint: 0xff0000,
                gap: 13,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 1,
                },
                pupilsTx: Tx.Enemy.Suggestive.Pupil,
                pupilsTint: [0x000080, 0x0000a0],
                scleraTx: Tx.Enemy.Suggestive.Sclera,
                sclerasMirrored: true,
            },
            mouth: {
                negativeSpaceTint: 0x000080,
                teethCount: 0,
                toothGapWidth: 1,
                txs: objAngelMouth.txs.rounded11,
            },
            sprites: {
                face: Tx.Enemy.Suggestive.Face,
                frontDecoration: Tx.Empty16,
                arms: Tx.Empty16,
            },
            tints: {
                gear0: 0x0000ff,
                gear1: 0x00ff00,
                map: [0xCE3010, 0x5D9938, 0x241DE2, 0xffffff] as MapRgbFilter.Map,
                spirit: [0xCE3010, 0xDEB742, 0xDEB742] as MapRgbFilter.Map,
            },
        },
        {
            sprites: {
                face: (obj) => obj.tinted(0xa0ff00),
            },
        },
    );

    return {
        common: template.createTheme(
            {},
            {
                mouth: (obj) => obj.add(0, -1),
            },
        ),
        freakish: template.createTheme(
            {
                eyes: {
                    defaultEyelidRestingPosition: 2,
                    gap: 8,
                    pupilRestStyle: {
                        kind: "cross_eyed",
                        offsetFromCenter: 5,
                    },
                    scleraTx: Tx.Enemy.Suggestive.ScleraWide,
                },
                sprites: {
                    face: Tx.Enemy.Suggestive.FaceWide,
                },
                tints: {
                    map: [0x208525, 0xffc21c, 0x5D9938, 0xffffff],
                    spirit: [0x208525, 0x71EC4F, 0xffc21c],
                },
            },
            {
                eyes: (obj) => obj.add(0, 5),
                sprites: {
                    face: (obj) => obj.tinted(0xa000ff).add(0, 5),
                },
            },
        ),
        uberMongo: template.createTheme(
            {
                eyes: {
                    defaultEyelidRestingPosition: 7,
                    scleraTx: Tx.Enemy.Suggestive.ScleraDiagonal,
                    pupilsTx: Tx.Enemy.Suggestive.PupilWack,
                    eyelidsTint: 0xd00000,
                    gap: 20,
                },
                mouth: {
                    txs: objAngelMouth.txs.w14,
                },

                sprites: {
                    arms: Tx.Enemy.Suggestive.Arms0,
                    face: Tx.Enemy.Suggestive.FaceIrregular,
                },
                tints: {
                    map: [0x6800f0, 0xeeff03, 0xae38cc],
                    spirit: [0x6800F0, 0xC027FF, 0xEEFF03],
                },
            },
            {
                eyes: obj => obj.add(-8, -8),
                mouth: obj => obj.add(-8, -8),
                sprites: {
                    arms: obj => obj.pivoted(14, 0),
                    face: obj => obj.tinted(0xb000b0).add(-8, -4),
                },
            },
        ),
        fallen: template.createTheme(
            {
                eyes: {
                    pupilsMirrored: true,
                    defaultEyelidRestingPosition: 7,
                    pupilsTx: Tx.Enemy.Suggestive.PupilWack,
                    scleraTx: Tx.Enemy.Suggestive.ScleraAngy,
                    gap: 20,
                },
                mouth: {
                    txs: objAngelMouth.txs.rounded14,
                },
                sprites: {
                    arms: Tx.Enemy.Suggestive.ArmsGrumpy,
                    face: Tx.Enemy.Suggestive.FaceUnruly,
                    frontDecoration: Tx.Enemy.Suggestive.Ruff,
                },
                tints: {
                    map: [0x6800f0, 0xeeff03, 0xae38cc],
                    spirit: [0x6800F0, 0xC027FF, 0xEEFF03],
                },
            },
            {
                eyes: obj => obj.add(-5, -10),
                mouth: (obj) => obj.add(-5, -6),
                sprites: {
                    arms: obj => obj.pivoted(32, 0),
                    face: obj => obj.add(-5, -6).tinted(0x0000ff),
                },
            },
        ),
    };
})();

type Theme = ValuesOf<typeof themes>;

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 25,
            conditions: {
                overheat: {
                    max: 40,
                },
            },
        },
        loot: {
            tier0: [
                { kind: "valuables", max: 7, min: 1, deltaPride: -5 },
            ],
            tier1: [
                { kind: "pocket_item", id: "ComputerChip", weight: 31 },
                { kind: "pocket_item", id: "BallFruitTypeA", weight: 14 },
                { kind: "pocket_item", id: "BallFruitTypeB", weight: 14 },
                { kind: "flop", min: 10, max: 14, weight: 12 },
                { kind: "potion", id: "Poison", weight: 8 },
                { kind: "key_item", id: "SeedYellow", weight: 5 },
                { kind: "equipment", id: "RichesRing", weight: 2 },
                { kind: "nothing", weight: 14 },
            ],
        },
    }),
    level1: RpgEnemyRank.create({
        status: {
            healthMax: 39,
            conditions: {
                overheat: {
                    max: 60,
                },
            },
        },
        loot: {
            tier0: [
                { kind: "valuables", max: 8, min: 2, deltaPride: -3 },
            ],
            tier1: [
                { kind: "pocket_item", id: "ComputerChip", weight: 50 },
                { kind: "flop", min: 0, max: 9, weight: 19 },
                { kind: "potion", id: "RestoreHealth", weight: 8 },
                { kind: "key_item", id: "SeedGreen", weight: 7 },
                { kind: "equipment", id: "PoisonRing", weight: 6 },
                { kind: "nothing", weight: 10 },
            ],
        },
    }),
    level2: RpgEnemyRank.create({
        status: {
            healthMax: 55,
        },
        loot: {
            tier0: [
                { kind: "valuables", max: 8, min: 2, deltaPride: -3 },
            ],
            tier1: [
                { kind: "potion", id: "RestoreHealth", weight: 20 },
                { kind: "key_item", id: "SeedPurple", weight: 15 },
                { kind: "key_item", id: "FlopBlindBoxTypeB", weight: 30 },
                { kind: "key_item", id: "FlopBlindBoxTypeB", weight: 25, count: 2 },
                { kind: "nothing", weight: 10 },
            ],
        },
    }),
    level3: RpgEnemyRank.create({
        status: {
            healthMax: 99,
        },
        loot: {
            tier0: [
                { kind: "valuables", max: 40, min: 25, deltaPride: -10 },
            ],
            tier1: [
                { kind: "potion", id: "RestoreHealth", weight: 20, count: 2 },
                { kind: "key_item", id: "FlopBlindBoxTypeB", weight: 35, count: 3 },
                { kind: "key_item", id: "FlopBlindBoxTypeB", weight: 30, count: 4 },
                { kind: "key_item", id: "FlopBlindBoxTypeB", weight: 15, count: 6 },
            ],
        },
    }),
    level4: RpgEnemyRank.create({
        status: {
            healthMax: 300,
        },
        loot: {
            tier0: [
                { kind: "valuables", max: 100, min: 60, deltaPride: -10 },
            ],
        },
    }),
};

type Feature =
    | "electrical_pulse"
    | "spiked_canonball"
    | "teleportation"
    | "spiked_canonball:many"
    | "spiked_canonball:poisonous"
    | "spiked_canonball:quick";

const variants = {
    level0: {
        features: new Set<Feature>(["spiked_canonball"]),
        theme: themes.common,
        rank: ranks.level0,
    },
    level1: {
        features: new Set<Feature>(["spiked_canonball", "electrical_pulse"]),
        theme: themes.freakish,
        rank: ranks.level1,
    },
    level2: {
        features: new Set<Feature>(["electrical_pulse", "teleportation"]),
        theme: themes.uberMongo,
        rank: ranks.level2,
    },
    level3: {
        features: new Set<Feature>(["electrical_pulse", "teleportation", "spiked_canonball", "spiked_canonball:many"]),
        theme: themes.fallen,
        rank: ranks.level3,
    },
    level4: {
        features: new Set<Feature>([
            "electrical_pulse",
            "teleportation",
            "spiked_canonball",
            "spiked_canonball:many",
            "spiked_canonball:poisonous",
            "spiked_canonball:quick",
        ]),
        theme: themes.fallen,
        rank: ranks.level4,
    },
};

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
    const eyesObj = theme.createEyesObj();

    const mouthObj = theme.createMouthObj()
        .add(0, 9)
        .merge({
            agape: false,
        })
        .step(self => {
            self.controls.agapeUnit = approachLinear(self.controls.agapeUnit, self.agape ? 1 : 0, 0.2);
        });

    const spr = theme.createSprite("face").anchored(0.5, 0.5)
        .mixin(
            mxnBoilMirrorRotate,
        );

    return container(spr, eyesObj, mouthObj).merge({ eyesObj, mouthObj });
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

export function objAngelSuggestive(entity: OgmoEntities.EnemySuggestive) {
    const { features, rank, theme } = variants[entity.values.variant];
    // TODO I feel like levels.js should handle this conversion...
    const safeTint = StringConvert.toRgbInt(entity.values.safeTint ?? "#ffffff");

    const faceObj = objAngelSuggestiveFace(theme);

    const irregularShadowObj = Sprite.from(Tx.Light.ShadowIrregularSmallRound).anchored(0.5, 0.5).tinted(0xC00000).at(
        27,
        1,
    )
        .mixin(mxnBoilMirrorRotate);

    const hurtbox0 = new Graphics().beginFill(0).drawRect(-30, -11, 60, 25).invisible();
    const hurtbox1 = new Graphics().beginFill(0).drawRect(-10, 12, 20, 25).invisible();

    const bodyObj = objAngelSuggestiveBody().pivoted(36, 46);

    const healthbarAnchorObj = new Graphics().beginFill(0xff0000).drawRect(-11, -45, 17, 30).invisible();

    const armsObj = theme.createSprite("arms").add(2, 16);

    const actualHeadObj = container(
        bodyObj,
        armsObj,
        theme.createSprite("frontDecoration").add(-22, 14),
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
        });

    const legsObj = objAngelPlantLegs({ objToBounce: actualHeadObj }).pivoted(18, -17);

    const obj = container(
        legsObj,
        actualHeadObj,
        healthbarAnchorObj,
    )
        .mixin(mxnEnemy, {
            rank,
            hurtboxes: [hurtbox0, hurtbox1],
            healthbarAnchorObj,
        })
        .mixin(mxnEnemyDeathBurst, { map: theme.tints.spirit })
        .mixin(mxnDetectPlayer);

    armsObj
        .step(self => {
            const dx = Math.sign(obj.mxnDetectPlayer.relativePosition.x);
            if (dx !== 0) {
                self.scale.x = dx;
            }
        });

    const moves = {
        *launchCanonball(timeScale = 1) {
            const poisonous = features.has("spiked_canonball:poisonous") && timeScale < 1;
            const attack = poisonous ? atks.spikedCanonballPoisonous : atks.spikedCanonball;

            if (timeScale < 1) {
                objFxRipple(
                    {
                        radius: 0,
                        stroke: 3,
                        tint: 0xC027FF,
                    },
                    {
                        radius: 100,
                        stroke: 0,
                        tint: 0xEEFF03,
                    },
                )
                    .mxnFxFactor
                    .play(3000 * timeScale)
                    .at(obj)
                    .add(0, -30)
                    .show();
                obj.play(Sfx.Enemy.Suggestive.Quick.rate(0.95, 1.05));
            }

            bodyObj.bulge.phase = "inflating";
            bodyObj.bulge.unit = 0;
            yield interp(bodyObj.bulge, "unit").to(1).over(1000 * timeScale);
            yield sleep(500 * timeScale);
            bodyObj.bulge.phase = "bursting";
            bodyObj.bulge.unit = 0;
            yield interp(bodyObj.bulge, "unit").to(1).over(1000 * timeScale);
            yield sleep(500 * timeScale);
            if (features.has("spiked_canonball:many")) {
                bodyObj.bulge.phase = "recovering";
                bodyObj.bulge.unit = 0;
                for (let i = 0; i < 10; i++) {
                    const f = nlerp(-1, 1, i / 9);
                    obj.play(Sfx.Enemy.Suggestive.Flick.rate(0.8 + i * 0.1));
                    const canonballObj = objAngelSuggestiveSpikedCanonball(obj.status, attack)
                        .at(obj)
                        .show();

                    canonballObj.speed.at(f * 2.3, -8);
                    bodyObj.bulge.unit += 0.05;
                    yield sleepf(3);
                }
                yield interp(bodyObj.bulge, "unit").to(1).over(500 * timeScale);
            }
            else {
                obj.play(Sfx.Enemy.Suggestive.Flick.rate(0.9, 1.1));
                const canonballObj = objAngelSuggestiveSpikedCanonball(obj.status, attack).at(obj).show();
                canonballObj.speed.x = obj.mxnDetectPlayer.position.x > obj.x ? 2 : -2;
                canonballObj.speed.y = -8;
                bodyObj.bulge.phase = "recovering";
                bodyObj.bulge.unit = 0;
                yield interp(bodyObj.bulge, "unit").to(1).over(1000 * timeScale);
            }
        },
        *fireElectricalPulse() {
            if (
                Math.abs(obj.mxnDetectPlayer.position.x - obj.x) > 300
                || Math.abs(obj.mxnDetectPlayer.position.y - obj.y) > 60
            ) {
                return;
            }

            faceObj.mouthObj.controls.frowning = true;
            obj.play(Sfx.Enemy.Suggestive.Lift.rate(0.9, 1.1));
            yield interpvr(obj.pivot).factor(factor.sine).to(0, 16).over(250);
            objAngelSuggestiveElectricalPulseGround(obj).at(obj).show().zIndexed(
                ZIndex.Entities - 1,
            );
            yield sleep(500);
            faceObj.mouthObj.controls.frowning = false;
            obj.play(Sfx.Enemy.Suggestive.Unlift.rate(0.9, 1.1));
            yield interpvr(obj.pivot).factor(factor.sine).to(0, 0).over(250);
            yield sleep(1000);
        },
        *teleport() {
            if (!obj.mxnDetectPlayer.isDetected || obj.mxnCollectDroppedItems.isTargetedForDrop) {
                return;
            }

            const maybePosition = findTeleportPosition(safeTint);

            if (!maybePosition) {
                return;
            }

            obj.play(Sfx.Enemy.Suggestive.Teleport.rate(0.9, 1));
            const position = vnew(maybePosition).add(0, -38);

            objFxFormativeBurst(0xf020f0)
                .at(obj)
                .show();

            objFxFormativeBurst(0xf020f0)
                .at(position)
                .show();

            yield interpv(obj.scale).steps(3).to(0, 0).over(666);
            obj.at(position);
            yield interpv(obj.scale).steps(3).to(1, 1).over(666);
        },
        *usePotionAndMaybeAttack() {
            yield* obj.mxnRpgStatusPotions.dramaUseAppropriatePotion();
            if (features.has("spiked_canonball:quick")) {
                yield* moves.launchCanonball(0.3);
            }
            else if (features.has("electrical_pulse")) {
                yield* moves.fireElectricalPulse();
            }
        },
    };

    return obj
        .filtered(new MapRgbFilter(...theme.tints.map))
        .coro(function* (self) {
            if (!features.has("spiked_canonball")) {
                bodyObj.bulge.phase = "inflating";
                bodyObj.bulge.unit = 1;
            }

            while (true) {
                let move: Coro.Type | Coro.Predicate = () => true;

                if (self.mxnRpgStatusPotions.hasPotionToUse()) {
                    move = moves.usePotionAndMaybeAttack();
                }
                else if (features.has("spiked_canonball")) {
                    move = moves.launchCanonball();
                }
                else if (features.has("electrical_pulse")) {
                    move = moves.fireElectricalPulse();
                }

                yield* Coro.all([
                    sleep(4000),
                    move,
                ]);

                if (
                    features.has("spiked_canonball")
                    && features.has("electrical_pulse")
                ) {
                    const playerDistanceBeforePulse = Math.abs(self.mxnDetectPlayer.relativePosition.x);
                    yield* moves.fireElectricalPulse();

                    const fireQuickCanonball =
                        Math.abs(self.mxnDetectPlayer.relativePosition.x) < playerDistanceBeforePulse
                        || Rng.bool();

                    if (features.has("spiked_canonball:quick") && fireQuickCanonball) {
                        yield* moves.launchCanonball(0.3);
                    }
                }
                if (features.has("teleportation")) {
                    yield* moves.teleport();

                    if (features.has("electrical_pulse")) {
                        yield* moves.fireElectricalPulse();
                    }
                }
            }
        })
        .coro(function* (self) {
            while (true) {
                yield () => self.mxnDetectPlayer.detectionScore > 0;
                objFxExpressSurprise().at(self).add(0, -20).show();
                legsObj.controls.bounceEnabled = false;
                actualHeadObj.pivot.y = 4;
                yield sleepf(2);
                actualHeadObj.pivot.y = 10;
                yield sleepf(16);
                yield interpvr(actualHeadObj.pivot).factor(factor.sine).to(0, 0).over(90);
                legsObj.controls.bounceEnabled = true;
                yield () => self.mxnDetectPlayer.detectionScore <= 0;
            }
        });
}

const atks = {
    spikedCanonball: RpgAttack.create({
        physical: 30,
    }),
    spikedCanonballPoisonous: RpgAttack.create({
        physical: 30,
        conditions: {
            poison: {
                value: 100,
            },
        },
    }),
    electricalPulseGround: RpgAttack.create({
        emotional: 40,
    }),
};

function objAngelSuggestiveSpikedCanonball(status: RpgStatus.Model, attack: RpgAttack.Model) {
    return objSpikedCanonball()
        .mixin(mxnRpgAttack, { attack, attacker: status })
        .mixin(mxnStopAndDieWhenHitGround);
}

function objAngelSuggestiveElectricalPulseGround(attacker: MxnRpgStatus & MxnDetectPlayer) {
    return objProjectileElectricalPulseGround(32)
        .mixin(mxnRpgAttack, { attack: atks.electricalPulseGround, attacker: attacker.status })
        .coro(function* (self) {
            yield () => self.mxnDischargeable.isCharged;
            self.speed.x = (Math.sign(attacker.mxnDetectPlayer.position.x - self.x) || 1) * 3;
            yield* Coro.race([
                Coro.all([
                    () => Math.abs(attacker.mxnDetectPlayer.position.x - self.x) < 10,
                    sleep(333),
                ]),
                sleep(2000),
            ]);
            self.mxnDischargeable.discharge();
        })
        .show();
}

const safeMarkerClaims = new WeakMap<DisplayObject, Integer>();
const teleportPreventionObjs = new Array<DisplayObject>();

const offset = vnew(0, -6);

function findTeleportPosition(tint: RgbInt): VectorSimple | null {
    teleportPreventionObjs.length = 0;
    teleportPreventionObjs.push(...Instances(mxnEnemy));
    teleportPreventionObjs.push(playerObj);

    for (const safeMarkerObj of Instances(objSafeMarker, obj => obj.tint === tint)) {
        const claimTick = safeMarkerClaims.get(safeMarkerObj) ?? -999;
        if (scene.ticker.ticks - claimTick < 180) {
            continue;
        }

        if (safeMarkerObj.collidesOne(teleportPreventionObjs, offset)) {
            continue;
        }

        safeMarkerClaims.set(safeMarkerObj, scene.ticker.ticks);
        return safeMarkerObj;
    }

    return null;
}
