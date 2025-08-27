import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { IRectangle } from "../../../lib/math/rectangle";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { scene } from "../../globals";
import { MxnDetectPlayer, mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnIndexedCollisionShape } from "../../mixins/mxn-indexed-collision-shape";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { MxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxSpiritualRelease } from "../effects/obj-fx-spiritual-release";
import { objFxStarburst54 } from "../effects/obj-fx-startburst-54";
import { objProjectileIndicatedBox } from "../projectiles/obj-projectile-indicated-box";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { objAngelEyes } from "./obj-angel-eyes";
import { objAngelMouth } from "./obj-angel-mouth";

const txsFistSlam = Tx.Enemy.Miffed.FistSlam.split({ count: 6 });

const themes = {
    Common: {
        tint: {
            primary: 0xFF77B0,
            secondary: 0x715EFF,
        },
    },
};
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
} satisfies Record<string, RpgEnemyRank.Model>;
const variants = {};

export function objAngelMiffed() {
    const hurtboxObjs = [
        new Graphics().beginFill(0).drawRect(4, 10, 40, 16).invisible(),
        new Graphics().beginFill(0).drawRect(11, 22, 24, 16).invisible(),
    ];

    const headObj = objAngelMiffedHead();
    const slammingFistRightObj = objSlammingFist("right");
    const slammingFistLeftObj = objSlammingFist("left");
    const soulAnchorObj = new Graphics().beginFill(0).drawRect(0, 0, 1, 1).at(21, 18).invisible();

    const bodyObj = objAngelBody();

    const obj = container(bodyObj, headObj, slammingFistRightObj, slammingFistLeftObj, ...hurtboxObjs, soulAnchorObj)
        .filtered(new MapRgbFilter(themes.Common.tint.primary, themes.Common.tint.secondary))
        .pivoted(22, 41);

    return container(obj)
        .autoSorted()
        .mixin(mxnEnemy, {
            hurtboxes: hurtboxObjs,
            rank: ranks.level0,
            angelEyesObj: headObj.objects.faceObj.objects.eyesObj,
            soulAnchorObj,
        })
        .mixin(mxnEnemyDeathBurst, {
            primaryTint: themes.Common.tint.primary,
            secondaryTint: themes.Common.tint.secondary,
            tertiaryTint: themes.Common.tint.primary,
        })
        .mixin(mxnPhysics, { gravity: 0.2, physicsRadius: 6, physicsOffset: [0, -7] })
        .mixin(mxnDetectPlayer)
        .coro(function* (self) {
            for (const fistObj of [slammingFistLeftObj, slammingFistRightObj]) {
                fistObj.mixin(
                    mxnRpgAttack,
                    { attacker: self.status, attack: atkFistSwing },
                );
            }

            let minDetectionScore = 0;

            while (true) {
                if (self.mxnDetectPlayer.detectionScore <= minDetectionScore) {
                    yield () => self.mxnDetectPlayer.detectionScore > minDetectionScore;
                    self.speed.y = -2;
                    yield () => self.isOnGround;
                }

                if (minDetectionScore === -120 && Rng.float() > 0.25) {
                    const vibrateObj = container()
                        .step(() => self.pivot.x = Math.round(Math.sin(scene.ticker.ticks / 15 * Math.PI)) * 2)
                        .show(self);
                    yield sleep(125);
                    const poisonBoxObj = objAngelMiffedPoisonBox(self).at(self).show();
                    yield () => poisonBoxObj.mxnDischargeable.isDischarged;
                    self.speed.y = -2;
                    yield () => poisonBoxObj.destroyed;
                    vibrateObj.destroy();
                    self.pivot.x = 0;
                }

                minDetectionScore = -120;

                for (const fistObj of [slammingFistLeftObj, slammingFistRightObj]) {
                    yield interp(fistObj.controls, "exposedUnit").steps(3).to(1).over(300);
                    yield interp(fistObj.controls, "slamUnit").to(1).over(500);
                    objAngelMiffedStarburstAttack().at(fistObj.state.slamFistWorldPosition).mixin(
                        mxnRpgAttack,
                        { attacker: self.status, attack: atkSlamStarburst },
                    ).show();

                    self.speed.at(fistObj === slammingFistRightObj ? 1 : -1, -3);
                    yield sleep(250);
                    yield interp(fistObj.controls, "exposedUnit").steps(3).to(0).over(300);
                    yield sleep(250);
                    fistObj.controls.slamUnit = 0;
                }
                self.speed.at(self.mxnDetectPlayer.position.x < self.x ? -2 : 2, -7);
                yield () => self.speed.y >= 0;
                const attackObj = objAngelMiffedSlamAttack().mixin(
                    mxnRpgAttack,
                    { attacker: self.status, attack: atkBodySlamStarburst },
                ).zIndexed(-1).show(self);
                self.gravity = 0;
                self.status.quirks.isImmuneToPlayerMeleeAttack = true;
                self.speed.at(0, 0);
                self.scale.y = -1;
                self.pivot.y = -25;
                yield sleep(250);
                self.gravity = 1;
                yield () => self.speed.y === 0 && self.isOnGround;
                self.status.quirks.isImmuneToPlayerMeleeAttack = false;
                yield interpv(attackObj.scale).steps(4).to(0, 0).over(250);
                attackObj.destroy();
                self.gravity = 0.2;
                self.scale.y = 1;
                self.pivot.y = 0;
            }
        })
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

            headObj.objects.faceObj.objects.mouthObj.controls.agapeUnit = approachLinear(
                headObj.objects.faceObj.objects.mouthObj.controls.agapeUnit,
                self.isOnGround ? 0 : 1,
                0.3,
            );
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

function objAngelMiffedHead() {
    const faceObj = objAngelMiffedFace().pivoted(-20, -15);

    return container(
        Sprite.from(Tx.Enemy.Miffed.Noggin0),
        faceObj,
    ).merge({ objects: { faceObj } });
}

function objAngelMiffedFace() {
    const eyesObj = objAngelEyes({
        defaultEyelidRestingPosition: 0,
        eyelidsTint: 0xc80000,
        gap: 11,
        pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 0 },
        pupilTx: Tx.Enemy.Miffed.Pupil0,
        pupilsMirrored: true,
        scleraTx: Tx.Enemy.Miffed.Sclera0,
        sclerasMirrored: true,
    });

    eyesObj.left.pupilSpr.tint = 0;
    eyesObj.right.pupilSpr.tint = 0;

    const mouthObj = objAngelMouth({
        negativeSpaceTint: 0x000000,
        teethCount: 1,
        toothGapWidth: 1,
        txs: objAngelMouth.txs.rounded14,
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

const atkPoisonBox = RpgAttack.create({
    conditions: {
        poison: 5,
    },
});

const getPoisonBoxTargetPosition = function () {
    const v = vnew();

    return (detected: mxnDetectPlayer.Context) => v.at(detected.position).add(detected.facing * 64, 0);
}();

function objAngelMiffedPoisonBox(attacker: MxnRpgStatus & MxnDetectPlayer) {
    const tint = 0x4A7825;
    return objProjectileIndicatedBox(64, 64)
        .mixin(mxnRpgAttack, { attack: atkPoisonBox, attacker: attacker.status })
        .tinted(tint)
        .coro(function* (self) {
            yield interpvr(self).factor(factor.sine).to(getPoisonBoxTargetPosition(attacker.mxnDetectPlayer)).over(700);
            const trackBehaviorObj = container()
                .step(() => self.moveTowards(getPoisonBoxTargetPosition(attacker.mxnDetectPlayer), 2).vround())
                .show(self);
            yield () => self.mxnDischargeable.isCharged;
            yield sleep(500);
            trackBehaviorObj.destroy();
            yield sleep(150);
            // TODO should be a special effect for this
            objFxSpiritualRelease().tinted(tint)
                .scaled(-1, 1)
                .at(self)
                .add(-16, 32)
                .show();
            objFxSpiritualRelease().tinted(tint)
                .scaled(1, 1)
                .angled(-90)
                .at(self)
                .add(40, -16)
                .show();
            objFxSpiritualRelease().tinted(tint)
                .scaled(-1, -1)
                .at(self)
                .add(-8, -38)
                .show();
            objFxSpiritualRelease().tinted(tint)
                .scaled(1, 1)
                .at(self)
                .add(34, 34)
                .show();
            self.mxnDischargeable.discharge();
        });
}
