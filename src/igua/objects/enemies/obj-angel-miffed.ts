import { Graphics, Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { blendColor } from "../../../lib/color/blend-color";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interp, interpc, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { vrad } from "../../../lib/math/angle";
import { approachLinear } from "../../../lib/math/number";
import { PolarInt, RgbInt } from "../../../lib/math/number-alias-types";
import { IRectangle } from "../../../lib/math/rectangle";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { scene } from "../../globals";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { MxnDetectPlayer, mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnIndexedCollisionShape } from "../../mixins/mxn-indexed-collision-shape";
import { mxnPhysics, PhysicsFaction } from "../../mixins/mxn-physics";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { MxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxExpressSurprise } from "../effects/obj-fx-express-surprise";
import { objFxFizzle } from "../effects/obj-fx-fizzle";
import { objFxFormativeBurst } from "../effects/obj-fx-formative-burst";
import { objFxHeart } from "../effects/obj-fx-heart";
import { objFxSpiritualRelease } from "../effects/obj-fx-spiritual-release";
import { objFxStarburst54 } from "../effects/obj-fx-startburst-54";
import { objGroundSpawner } from "../obj-ground-spawner";
import { objProjectileFlameColumn } from "../projectiles/obj-projectile-flame-column";
import { objProjectileIndicatedBox } from "../projectiles/obj-projectile-indicated-box";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { objAngelEyes } from "./obj-angel-eyes";
import { objAngelMouth } from "./obj-angel-mouth";

const txsFistSlam = Tx.Enemy.Miffed.FistSlam.split({ count: 6 });

const themes = (function () {
    const commonTheme = {
        pivots: {
            noggin: vnew(0, 0),
        },
        textures: {
            mouth: objAngelMouth.txs.w14,
            noggin: Tx.Enemy.Miffed.Noggin0,
            pupil: Tx.Enemy.Miffed.Pupil0,
            sclera: Tx.Enemy.Miffed.Sclera0,
        },
        tint: {
            primary: 0xFF77B0,
            secondary: 0x715EFF,
            tertiary: 0xfffb0e,
        },
        values: {
            eyesGap: 11,
        },
    };

    type CommonTheme = typeof commonTheme;

    return {
        Common: commonTheme,
        Freakish: {
            ...commonTheme,
            pivots: {
                noggin: vnew(10, 4),
            },
            textures: {
                mouth: objAngelMouth.txs.rounded14,
                noggin: Tx.Enemy.Miffed.Noggin1,
                pupil: Tx.Enemy.Miffed.Pupil1,
                sclera: Tx.Enemy.Miffed.Sclera1,
            },
            tint: {
                primary: 0x9052c4,
                secondary: 0xc22419,
                tertiary: 0x1e803e,
            },
            values: {
                eyesGap: 20,
            },
        },
    } satisfies Record<string, CommonTheme>;
})();

type Theme = typeof themes[keyof typeof themes];

const ranks = {
    level0: RpgEnemyRank.create({
        loot: {
            // TODO idk
            tier0: [{ kind: "valuables", deltaPride: -1, max: 10, min: 1 }],
            tier1: [
                { kind: "potion", id: "Poison", weight: 25 },
                { kind: "key_item", id: "SeedPurple", weight: 15 },
                { kind: "key_item", id: "FlopBlindBox", weight: 15 },
                { kind: "equipment", id: "FactionDefenseMiner", weight: 10 },
                { kind: "nothing", weight: 35 },
            ],
        },
        status: {
            healthMax: 60,
        },
    }),
    level1: RpgEnemyRank.create({
        loot: {
            tier0: [{ kind: "valuables", deltaPride: -5, max: 70, min: 15 }],
            tier1: [
                { kind: "potion", id: "Ballon", weight: 5 },
                { kind: "valuables", deltaPride: -10, max: 70, min: 30, weight: 5 },
                { kind: "key_item", id: "UninflatedBallon", count: 5, weight: 30 },
                { kind: "key_item", id: "UninflatedBallon", count: 8, weight: 5 },
                { kind: "flop", min: 15, max: 19, weight: 15 },
                { kind: "nothing", weight: 40 },
            ],
        },
        status: {
            healthMax: 250,
            defenses: {
                physical: 100,
            },
            quirks: {
                emotionalDamageIsFatal: true,
            },
        },
    }),
} satisfies Record<string, RpgEnemyRank.Model>;

const variants = {
    level0: {
        rank: ranks.level0,
        theme: themes.Common,
    },
    level1: {
        rank: ranks.level1,
        theme: themes.Freakish,
    },
};

export function objAngelMiffed(entity: OgmoEntities.EnemyMiffed) {
    const { rank, theme } = variants[entity.values.variant];

    const hurtboxObjs = [
        new Graphics().beginFill(0).drawRect(4, 10, 40, 16).invisible(),
        new Graphics().beginFill(0).drawRect(11, 22, 24, 16).invisible(),
    ];

    const headObj = objAngelMiffedHead(theme);
    const wrappedHeadObj = container(headObj);
    const slammingFistRightObj = objSlammingFist("right");
    const slammingFistLeftObj = objSlammingFist("left");
    const soulAnchorObj = new Graphics().beginFill(0).drawRect(0, 0, 1, 1).at(21, 18).invisible();

    const bodyObj = objAngelBody();

    const puppetObj = container(
        bodyObj,
        wrappedHeadObj,
        slammingFistRightObj,
        slammingFistLeftObj,
        ...hurtboxObjs,
        soulAnchorObj,
    )
        .filtered(
            new MapRgbFilter(theme.tint.primary, theme.tint.secondary, theme.tint.tertiary),
        )
        .pivoted(22, 41);

    const mouthObj = headObj.objects.faceObj.objects.mouthObj;

    const obj = container(puppetObj)
        .autoSorted()
        .mixin(mxnEnemy, {
            hurtboxes: hurtboxObjs,
            rank,
            soulAnchorObj,
        })
        .mixin(mxnEnemyDeathBurst, {
            primaryTint: theme.tint.primary,
            secondaryTint: theme.tint.secondary,
            tertiaryTint: theme.tint.primary,
        })
        .mixin(mxnPhysics, {
            gravity: 0.2,
            physicsRadius: 6,
            physicsOffset: [0, -7],
            physicsFaction: PhysicsFaction.Enemy,
        })
        .mixin(mxnDetectPlayer)
        .step(self => {
            let bodyObjY = 0;
            if (!self.isOnGround) {
                bodyObjY = self.speed.y < 0 ? -4 : -2;
            }
            bodyObj.pivot.y = -bodyObjY;

            if (self.speed.x > 0) {
                bodyObj.flipH(-1);
            }
            else if (self.speed.x < 0) {
                bodyObj.flipH(1);
            }

            if (self.isOnGround) {
                self.speed.x = approachLinear(self.speed.x, 0, 0.1);
            }

            mouthObj.controls.agapeUnit = approachLinear(
                mouthObj.controls.agapeUnit,
                mouthObj.controls.teethExposedUnit === 0 ? (self.isOnGround ? 0 : 1) : 1,
                0.3,
            );

            mouthObj.pivot.y = mouthObj.controls.teethExposedUnit === 0 ? 0 : (scene.ticker.ticks % 30 < 15 ? -2 : -1);
        });

    for (const fistObj of [slammingFistLeftObj, slammingFistRightObj]) {
        fistObj.mixin(
            mxnRpgAttack,
            { attacker: obj.status, attack: atkFistSwing },
        );
    }

    const moves = {
        *castPoisonMagic() {
            const vibrateObj = container()
                .step(() => obj.pivot.x = Math.round(Math.sin(scene.ticker.ticks / 15 * Math.PI)) * 2)
                .show(obj);

            yield sleep(125);

            mouthObj.controls.teethExposedUnit = 1;
            const eyeRollerObj = objAngelEyes.objEyeRoller(headObj.objects.faceObj.objects.eyesObj).show(obj);
            const poisonBoxObj = objAngelMiffedPoisonBox(obj).at(obj).show();

            yield () => poisonBoxObj.mxnDischargeable.isDischarged;

            mouthObj.controls.teethExposedUnit = 0;
            eyeRollerObj.destroy();
            obj.speed.y = -2;

            yield () => poisonBoxObj.destroyed;

            vibrateObj.destroy();
            obj.pivot.x = 0;
        },
        *slamFist(fistObj: ObjSlammingFist) {
            yield* Coro.all([
                interp(fistObj.controls, "exposedUnit").steps(3).to(1).over(300),
                Coro.chain([
                    sleep(150),
                    () => (objFxHeart.objBurst(10, 4)
                        .at(fistObj.getWorldPosition())
                        .coro(function* (self) {
                            self.play(Sfx.Enemy.Miffed.PunchArmAppear.rate(0.9, 1.1));
                        })
                        .show(),
                        true),
                ]),
            ]);
            yield interp(fistObj.controls, "slamUnit").to(1).over(500);
            objAngelMiffedStarburstAttack()
                .at(fistObj.state.slamFistWorldPosition)
                .mixin(
                    mxnRpgAttack,
                    { attacker: obj.status, attack: atkSlamStarburst },
                )
                .show()
                .play(Sfx.Enemy.Miffed.PunchLand.rate(0.9, 1.1));

            obj.speed.at(fistObj === slammingFistRightObj ? 1 : -1, -3);
            yield sleep(250);
            yield interp(fistObj.controls, "exposedUnit").steps(3).to(0).over(300);
            yield sleep(250);
            fistObj.controls.slamUnit = 0;
        },
        *dive(kind: "flame_column" | "default") {
            obj.play(Sfx.Enemy.Miffed.Jump.rate(0.9, 1.1));
            obj.speed.at(obj.mxnDetectPlayer.position.x < obj.x ? -2 : 2, -7);
            yield () => obj.speed.y >= 0;
            obj.play(Sfx.Enemy.Miffed.Pause.rate(0.9, 1.1));
            const attackObj = objAngelMiffedSlamAttack().mixin(
                mxnRpgAttack,
                { attacker: obj.status, attack: atkBodySlamStarburst },
            ).zIndexed(-1).show(obj);
            obj.gravity = 0;
            obj.status.quirks.isImmuneToPlayerMeleeAttack = true;
            obj.speed.at(0, 0);
            obj.scale.y = -1;
            obj.pivot.y = -25;

            if (kind === "flame_column") {
                obj.play(Sfx.Enemy.Miffed.FlameDiveWarn.rate(0.9, 1.1));
                objFxFormativeBurst(0xf0f000)
                    .at(obj)
                    .mixin(mxnDestroyAfterSteps, 30)
                    .show();
                yield sleep(100);
            }

            yield sleep(250);
            obj.play(Sfx.Enemy.Miffed.Dive.rate(0.9, 1.1));
            obj.gravity = kind === "flame_column" ? 1.33 : 1;
            yield () => obj.speed.y === 0 && obj.isOnGround;

            if (kind === "flame_column") {
                obj.play(Sfx.Enemy.Miffed.FlameDive.rate(0.95, 1.05));
                objAngelMiffedFlameColumnTrail(obj, -1).at(obj).add(-20, 0).show();
                objAngelMiffedFlameColumnTrail(obj, 1).at(obj).add(20, 0).show();
            }

            obj.play(Sfx.Enemy.Miffed.DiveLand.rate(0.9, 1.1));
            obj.status.quirks.isImmuneToPlayerMeleeAttack = false;
            yield interpv(attackObj.scale).steps(4).to(0, 0).over(250);
            attackObj.destroy();
            obj.gravity = 0.2;
            obj.scale.y = 1;
            obj.pivot.y = 0;
        },
        *sweepAndBackstep() {
            obj.play(Sfx.Enemy.Miffed.SweepBegin);
            yield interpvr(wrappedHeadObj).factor(factor.sine).to(0, 15).over(200);
            for (let i = 0; i < 4; i++) {
                obj.x += i % 2 === 0 ? 1 : -1;
                yield sleepf(3);
            }
            yield interpvr(wrappedHeadObj).to(0, 0).over(70);
            const playerSignX = Math.sign(obj.mxnDetectPlayer.position.x - obj.x) || Rng.intp();
            obj.gravity = 0.0825;
            obj.speed.at(-playerSignX * 2, -4);
            const attackObj = objAngelMiffedSweepAttack(obj, playerSignX).at(0, -32).show(obj);
            obj.isOnGround = false;
            yield* Coro.all([
                () => obj.isOnGround,
                () => attackObj.destroyed,
                interp(obj.speed, "x").to(0).over(1000),
            ]);
            obj.gravity = 0.2;
        },
        *expressSurprise() {
            obj.play(Sfx.Enemy.Miffed.ExpressSurprise.rate(0.9, 1.1));
            objFxExpressSurprise().at(obj).add(5, -32).show();
            obj.speed.y = -2;
            yield () => obj.speed.y >= 0 && obj.isOnGround;
        },
    };

    return obj
        .coro(function* (self) {
            const startPosition = self.vcpy();

            let minDetectionScore = 0;
            let iterationsCount = 0;

            while (true) {
                if (self.mxnDetectPlayer.detectionScore <= minDetectionScore) {
                    yield () => self.mxnDetectPlayer.detectionScore > minDetectionScore;
                    yield* moves.expressSurprise();
                }

                if (iterationsCount > 0 && Rng.float() > 0.25) {
                    yield* moves.castPoisonMagic();
                }

                minDetectionScore = -120;

                // TODO feels like this should be declared on the rank or something
                if (rank === ranks.level1) {
                    yield* moves.sweepAndBackstep();
                }

                let fistObjs = [slammingFistLeftObj, slammingFistRightObj];

                const distanceFromStartPosition = self.x - startPosition.x;
                if (Math.abs(distanceFromStartPosition) > 100) {
                    fistObjs = distanceFromStartPosition > 0
                        ? [slammingFistLeftObj, slammingFistLeftObj]
                        : [slammingFistRightObj, slammingFistRightObj];
                }

                for (const fistObj of fistObjs) {
                    yield* moves.slamFist(fistObj);
                }

                yield* moves.dive(obj.status.health / obj.status.healthMax < 0.67 ? "flame_column" : "default");
                iterationsCount++;
            }
        });
}

const fistRectangles: Record<number, IRectangle> = {
    2: { x: 79, y: 19, width: 9, height: 10 },
    3: { x: 146 - 90, y: 4, width: 11, height: 9 },
    4: { x: 194 - 180, y: 4, width: 15, height: 13 },
};

function objSlammingFist(side: "right" | "left") {
    let slamUnit = 0;

    const indexedSpriteObj = objIndexedSprite(txsFistSlam);
    const fistPositionObj = new Graphics().beginFill(0).at(9, 48).drawRect(0, 0, 1, 1).invisible();

    const obj = container(indexedSpriteObj, fistPositionObj)
        .mixin(mxnIndexedCollisionShape, { indexedSpriteObj, rectangles: fistRectangles })
        .pivoted(59, 41);

    if (side === "right") {
        obj.at(33, 29);
    }
    else {
        obj.at(12, 29);
    }

    const controls = {
        get exposedUnit() {
            return obj.scale.y;
        },
        set exposedUnit(value) {
            obj.scale.x = side === "right" ? value : -value;
            obj.scale.y = value;
        },
        get slamUnit() {
            return slamUnit;
        },
        set slamUnit(value) {
            indexedSpriteObj.textureIndex = value * indexedSpriteObj.textures.length - 1;
            slamUnit = value;
        },
    };

    const state = {
        get slamFistWorldPosition() {
            return fistPositionObj.getWorldPosition();
        },
    };

    controls.exposedUnit = 0;

    return obj.merge({ controls, state });
}

type ObjSlammingFist = ReturnType<typeof objSlammingFist>;

function objAngelMiffedHead(theme: Theme) {
    const faceObj = objAngelMiffedFace(theme).pivoted(-22, -15).mixin(mxnFacingPivot, {
        down: 2,
        left: -3,
        right: 5,
        up: -2,
    });

    return container(
        Sprite.from(theme.textures.noggin).pivoted(theme.pivots.noggin),
        faceObj,
    )
        .merge({ objects: { faceObj } })
        .mixin(mxnFacingPivot, {
            down: 1,
            left: -2,
            right: 2,
            up: 0,
        });
}

function objAngelMiffedFace(theme: Theme) {
    const eyesObj = objAngelEyes({
        defaultEyelidRestingPosition: 0,
        eyelidsTint: 0xc80000,
        gap: theme.values.eyesGap,
        pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 0 },
        pupilTx: theme.textures.pupil,
        pupilsMirrored: true,
        scleraTx: theme.textures.sclera,
        sclerasMirrored: true,
    });

    eyesObj.left.pupilSpr.tint = 0;
    eyesObj.right.pupilSpr.tint = 0;

    const mouthObj = objAngelMouth({
        negativeSpaceTint: 0x000000,
        teethCount: 2,
        toothGapWidth: 1,
        txs: theme.textures.mouth,
    })
        .at(0, 6);

    return container(eyesObj, mouthObj).merge({ objects: { eyesObj, mouthObj } });
}

function objAngelBody() {
    const leftLegObj = Sprite.from(Tx.Enemy.Miffed.Leg).at(-2, -1);
    const rightLegObj = Sprite.from(Tx.Enemy.Miffed.Leg).at(15, -1);
    const legsMaskObj = new Graphics().beginFill(0x000000).drawRect(-16, 8, 58, 12);
    const legsObj = container(leftLegObj, rightLegObj).masked(legsMaskObj);

    return container(legsObj, Sprite.from(Tx.Enemy.Miffed.Torso0).at(-3, 3), legsMaskObj)
        .at(10, 24);
}

function objAngelMiffedStarburstAttack() {
    const shape = new Graphics().beginFill(0).drawRect(-12, -12, 25, 25).invisible();
    const obj = objFxStarburst54();
    shape.show(obj);
    return obj.collisionShape(CollisionShape.DisplayObjects, [shape]).angled(Rng.int(4) * 90);
}

const txsFlameAura = Tx.Enemy.Miffed.FlameAura.split({ width: 72 });

function objAngelMiffedSlamAttack() {
    const shape = new Graphics().beginFill(0).drawRect(-30, -42, 60, 44).invisible();

    return container(
        objIndexedSprite(txsFlameAura).anchored(0.5, 0.5).step(self =>
            self.textureIndex = (self.textureIndex + 0.15) % txsFlameAura.length
        ),
        shape,
    )
        .collisionShape(CollisionShape.DisplayObjects, [shape]);
}

const atkFistSwing = RpgAttack.create({
    physical: 25,
});

const atkSlamStarburst = RpgAttack.create({
    physical: 40,
});

const atkBodySlamStarburst = RpgAttack.create({
    physical: 40,
});

const atkFlameColumn = RpgAttack.create({
    physical: 30,
});

const atkPoisonBox = RpgAttack.create({
    conditions: {
        poison: 5,
    },
});

const atkSweepOrb = RpgAttack.create({
    emotional: 40,
});

const getPoisonBoxTargetPosition = function () {
    const v = vnew();

    return (detected: mxnDetectPlayer.Context) => v.at(detected.position).add(detected.speed);
}();

function objAngelMiffedPoisonBox(attacker: MxnRpgStatus & MxnDetectPlayer) {
    const tint = 0x4A7825;
    return objProjectileIndicatedBox(80, 64)
        .mixin(mxnRpgAttack, { attack: atkPoisonBox, attacker: attacker.status })
        .tinted(tint)
        .coro(function* (self) {
            self.play(Sfx.Enemy.Miffed.PoisonAttackAppear.rate(0.95, 1.05));
            yield interpvr(self).factor(factor.sine).to(getPoisonBoxTargetPosition(attacker.mxnDetectPlayer)).over(700);
            const trackBehaviorObj = container()
                .step(() => self.moveTowards(getPoisonBoxTargetPosition(attacker.mxnDetectPlayer), 2).vround())
                .show(self);
            yield () => self.mxnDischargeable.isCharged;
            for (let i = 0; i < 3; i++) {
                self.play(Sfx.Enemy.Miffed.PoisonWarning.rate(1 + i * 0.15));
                self.tint = i === 2 ? 0xffffff : 0x9ae95a;
                yield sleep(67);
                yield interpc(self, "tint").to(tint).over(100);
            }
            trackBehaviorObj.destroy();
            yield sleep(150);
            self.play(Sfx.Enemy.Miffed.PoisonActive.rate(0.95, 1.05));
            objFxSpiritualRelease.objBurst({ halfWidth: 34, halfHeight: 26, tints: [0x6DAF36] })
                .at(self)
                .show();
            self.mxnDischargeable.discharge();
        });
}

function objAngelMiffedFlameColumnTrail(attacker: MxnRpgStatus, signX: PolarInt) {
    return objGroundSpawner({
        objFactory: () =>
            objProjectileFlameColumn().mixin(mxnRpgAttack, { attack: atkFlameColumn, attacker: attacker.status }),
        maxDistance: 100,
        speedX: 20 * signX,
    });
}

function objAngelMiffedSweepAttack(attacker: MxnRpgStatus, signX: PolarInt) {
    const tintStart = 0xe05620;
    const tintEnd = 0xf0f000;

    const fizzleTintStart = 0x909090;
    const fizzleTintEnd = 0x505050;

    return container()
        .coro(function* (self) {
            for (let i = 0; i < 0.5; i += 0.05) {
                self.parent.play(Sfx.Enemy.Miffed.SweepOrb.rate(i + 0.5));
                const tintBlend = i * 2;
                const orbObj = objAngelMiffedSweepAttackOrb(
                    attacker,
                    blendColor(tintStart, tintEnd, tintBlend),
                    blendColor(fizzleTintStart, fizzleTintEnd, tintBlend),
                )
                    .at(self.getWorldPosition())
                    .show();

                orbObj.speed.at(vrad((-0.5 + i * signX) * Math.PI)).scale(5);

                yield sleepf(4);
            }
            self.destroy();
        });
}

const orbTxs = Tx.Enemy.Miffed.SweepOrb.split({ width: 16 });

function objAngelMiffedSweepAttackOrb(attacker: MxnRpgStatus, tint: RgbInt, fizzleTint: RgbInt) {
    const sprite = objIndexedSprite(orbTxs).anchored(0.5, 0.5).at(0, 8).tinted(tint);
    return container(sprite)
        .pivoted(0, 8)
        .mixin(mxnRpgAttack, { attacker: attacker.status, attack: atkSweepOrb })
        .mixin(mxnPhysics, { physicsRadius: 8, gravity: 0.2, physicsOffset: [0, -8] })
        .mixin(mxnDestroyAfterSteps, 120)
        .handles("moved", (self, event) => {
            if (event.hitGround) {
                objFxFizzle().tinted(fizzleTint).at(self).show();
                self.destroy();
            }
        })
        .coro(function* (self) {
            sprite.scale.x = Math.sign(self.speed.x) || 1;
            yield interp(sprite, "textureIndex").to(sprite.textures.length).over(Rng.int(100, 200));
            yield sleepf(5);
            while (true) {
                sprite.angle += 90;
                yield sleepf(5);
            }
        });
}
