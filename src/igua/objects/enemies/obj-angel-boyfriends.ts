import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { nlerp } from "../../../lib/math/number";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ZIndex } from "../../core/scene/z-index";
import { mxnFxVibrate } from "../../mixins/effects/mxn-fx-vibrate";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxHeart } from "../effects/obj-fx-heart";
import { objProjectileLoveVortexAoe } from "../projectiles/obj-projectile-love-vortex-aoe";
import { ObjAngelMouth, objAngelMouth } from "./obj-angel-mouth";

interface ObjAngelBoyfriendsArgs {
    tints: {
        angry: RgbInt;
        sad: RgbInt;
        antlers: RgbInt;
    };
}

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 500,
        },
    }),
};

const atks = {
    pitchfork: RpgAttack.create({
        physical: 60,
    }),
    loveVortexAoe: RpgAttack.create({
        emotional: 50,
    }),
};

const [txIdle, txMove, txKissStart, txKiss, txPride, txFaceAngry, txFaceSad] = Tx.Enemy.Boyfriends.Bodies.split({
    width: 112,
});

const bodyTexturesSupportingFace = new Set([txIdle, txMove, txPride]);

export function objAngelBoyfriends(args: ObjAngelBoyfriendsArgs) {
    const tintMap: MapRgbFilter.Map = [args.tints.angry, args.tints.sad, args.tints.antlers, 0xffffff];

    const puppetObj = objAngelBoyfriendsPuppet()
        .filtered(new MapRgbFilter(...tintMap));

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(13, 23, 86, 49)
        .invisible();

    const soulAnchorObj = new Graphics()
        .beginFill(0xffffff)
        .drawRect(0, 0, 1, 1)
        .at(56, 40)
        .invisible();

    const obj = container(
        puppetObj,
        hurtboxObj,
        soulAnchorObj,
    )
        .mixin(mxnEnemy, { hurtboxes: [hurtboxObj], rank: ranks.level0, soulAnchorObj })
        .mixin(mxnEnemyDeathBurst, { map: tintMap })
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 0.3, physicsRadius: 30, physicsOffset: [0, -30] })
        .handles("damaged", (_, result) => {
            if (result.rejected) {
                return;
            }

            const mouthObj = Rng.choose(
                puppetObj.objAngelBoyfriendsPuppet.mouthObjs.angry,
                puppetObj.objAngelBoyfriendsPuppet.mouthObjs.sad,
            );

            mouthObj
                .coro(function* () {
                    yield holdf(() => mouthObj.controls.frowning = true, 30);
                    mouthObj.controls.frowning = false;
                });
        })
        .pivoted(56, 70)
        .zIndexed(ZIndex.Entities)
        .step(self => {
            puppetObj.objAngelBoyfriendsPuppet.movementSpeed.at(self.speed);
        })
        .coro(function* (self) {
            new Graphics()
                .beginFill(0xff0000)
                .drawRect(106, 43, 36, 25)
                .mixin(mxnRpgAttack, { attack: atks.pitchfork, attacker: self.status })
                .step(attackObj =>
                    attackObj.isAttackActive = puppetObj.objAngelBoyfriendsPuppet.pitchfork.appearUnit >= 1
                        && puppetObj.objAngelBoyfriendsPuppet.pitchfork.facingPolar > 0
                )
                .invisible()
                .show(self);

            new Graphics()
                .beginFill(0xff0000)
                .drawRect(-30, 43, 36, 25)
                .mixin(mxnRpgAttack, { attack: atks.pitchfork, attacker: self.status })
                .step(attackObj =>
                    attackObj.isAttackActive = puppetObj.objAngelBoyfriendsPuppet.pitchfork.appearUnit >= 1
                        && puppetObj.objAngelBoyfriendsPuppet.pitchfork.facingPolar < 0
                )
                .invisible()
                .show(self);
        });

    const movesState = {
        loveVortexesCount: 0,
    };

    const moves = {
        *putAwayPitchfork() {
            if (puppetObj.objAngelBoyfriendsPuppet.pitchfork.appearUnit > 0) {
                yield interp(puppetObj.objAngelBoyfriendsPuppet.pitchfork, "appearUnit").to(0).over(333);
            }
        },
        *pursuePlayerWithPitchfork() {
            const direction = Math.sign(obj.mxnDetectPlayer.relativePosition.x);
            if (puppetObj.objAngelBoyfriendsPuppet.pitchfork.appearUnit < 1) {
                puppetObj.objAngelBoyfriendsPuppet.pitchfork.facingPolar = direction;
                puppetObj.objAngelBoyfriendsPuppet.pitchfork.sparklesPerFrame = 0.3;
                yield interp(puppetObj.objAngelBoyfriendsPuppet.pitchfork, "appearUnit").to(1).over(1000);
                puppetObj.objAngelBoyfriendsPuppet.pitchfork.sparklesPerFrame = 0;
            }
            else {
                if (obj.isOnGround) {
                    obj.speed.y = -3;
                }

                yield* Coro.all([
                    interp(obj.speed, "x").to(0).over(333),
                    () => obj.isOnGround && obj.speed.y === 0,
                ]);
                puppetObj.objAngelBoyfriendsPuppet.pitchfork.facingPolar = direction;
            }
            yield* Coro.race([
                interp(obj.speed, "x").to(direction * 3).over(1000),
                () => obj.speed.x === 0,
            ]);
            yield () => obj.speed.x === 0;
            if (
                obj.isOnGround
                && (!obj.mxnDetectPlayer.isDetected || Math.sign(obj.mxnDetectPlayer.relativePosition.x) === direction)
            ) {
                obj.speed.at(0, -7);
                yield interp(obj.speed, "x").to(direction * 3).over(1000);
                if (!obj.mxnDetectPlayer.isDetected) {
                    yield interp(obj.speed, "x").to(0).over(300);
                }
            }
        },
        *loveVortex() {
            puppetObj.objAngelBoyfriendsPuppet.isExpressingPride = true;
            yield* Coro.all([
                moves.putAwayPitchfork(),
                interp(obj.speed, "x").to(0).over(333),
            ]);
            puppetObj.mxnFxVibrate.direction.at(0, -1);
            yield interp(puppetObj.mxnFxVibrate, "frequency").to(0.3).over(300);
            const vortexSpeed = movesState.loveVortexesCount++ === 0 ? "slow" : Rng.choose("slow", "fast");
            const vortexObj = objAngelBoyfriendsLoveVortexAoe(vortexSpeed)
                .mixin(mxnRpgAttack, { attack: atks.loveVortexAoe, attacker: obj.status })
                .zIndexed(ZIndex.TerrainDecals)
                .at(obj)
                .show();
            yield () => vortexObj.destroyed;
            puppetObj.mxnFxVibrate.frequency = 0;
            puppetObj.objAngelBoyfriendsPuppet.isExpressingPride = false;
        },
        *kiss(isStaggered: mxnEnemy.StaggeredPredicate) {
            yield* moves.putAwayPitchfork();
            yield* Coro.race([
                moves._kiss(),
                isStaggered,
            ]);
            if (isStaggered()) {
                obj.speed.y = -3;
            }
            yield interp(puppetObj.objAngelBoyfriendsPuppet, "kissUnit").to(0).over(500);
            puppetObj.mxnFxVibrate.frequency = 0;
        },
        *_kiss() {
            yield interp(puppetObj.objAngelBoyfriendsPuppet, "kissUnit").to(1).over(500);
            puppetObj.mxnFxVibrate.direction.at(1, 0);
            puppetObj.mxnFxVibrate.frequency = 0.2;
            yield sleep(333);
            objFxHeart()
                .at(obj)
                .add(0, -50)
                .show();
            obj.heal(50);
        },
    };

    return obj
        .coro(function* (self) {
            yield () => self.isOnGround;
            while (true) {
                const loveVortexChances = Rng.shuffle([true, true, false, false]);

                for (const loveVortexChance of loveVortexChances) {
                    if (!self.mxnDetectPlayer.isDetected) {
                        yield* moves.putAwayPitchfork();
                    }
                    if (
                        obj.status.health < obj.status.healthMax
                        && obj.speed.x === 0
                        && (!self.mxnDetectPlayer.isDetected || self.mxnDetectPlayer.relativePosition.vlength > 130)
                    ) {
                        yield* self.mxnEnemy.dramaStagger(moves.kiss);
                    }
                    yield () => self.mxnDetectPlayer.isDetected;
                    yield* moves.pursuePlayerWithPitchfork();
                    if (
                        self.mxnDetectPlayer.isDetected && self.mxnDetectPlayer.relativePosition.vlength < 150
                        && loveVortexChance
                    ) {
                        yield* moves.loveVortex();
                    }
                }
            }
        });
}

function objAngelBoyfriendsLoveVortexAoe(speed: "slow" | "fast") {
    return objProjectileLoveVortexAoe()
        .coro(function* (self) {
            yield interpvr(self.scale).to(200, 200).over(speed === "slow" ? 2000 : 1200);
            yield sleep(Rng.intc(400, 600));
            yield interpvr(self.scale).factor(factor.sine).to(0, 0).over(666);
            self.destroy();
        });
}

function objAngelBoyfriendsPuppet() {
    const mouthObjs = {
        angry: objAngelMouth({
            negativeSpaceTint: 0x000000,
            teethCount: 2,
            toothGapWidth: 2,
            txs: objAngelMouth.txs.rounded16weight3,
        })
            .at(34, 38),
        sad: objAngelMouth({
            negativeSpaceTint: 0x000000,
            teethCount: 4,
            toothGapWidth: 1,
            txs: objAngelMouth.txs.rounded16weight3,
        })
            .at(80, 37),
    };

    const api = {
        movementSpeed: vnew(),
        kissUnit: 0,
        isExpressingPride: false,
        mouthObjs,
        pitchfork: {
            sparklesPerFrame: 0,
            appearUnit: 0,
            facingPolar: 1,
        },
    };

    let pedometer = 0;

    const bodiesSprite = Sprite.from(txIdle);
    const faceObj = container(
        Sprite.from(txFaceAngry),
        Sprite.from(txFaceSad),
        mouthObjs.angry,
        mouthObjs.sad,
    )
        .mixin(mxnFacingPivot, { down: 3, left: -3, right: 3, up: -3 });

    const pitchforkObj = Sprite.from(Tx.Enemy.Boyfriends.Pitchfork)
        .mixin(mxnSparkling)
        .invisible()
        .anchored(0.5, 0.5)
        .at(78, 55)
        .step(self => {
            self.sparklesPerFrame = api.pitchfork.sparklesPerFrame;
            self.alpha = api.pitchfork.appearUnit < 1 ? 0.5 : 1;
            self.visible = api.pitchfork.appearUnit > 0;
            self.pivot.y = nlerp(32, 0, api.pitchfork.appearUnit) + (bodiesSprite.texture === txMove ? 1 : 0);
            self.scale.x = Math.sign(api.pitchfork.facingPolar);
            self.x = api.pitchfork.facingPolar > 0 ? 78 : 34;
        });

    return container(
        bodiesSprite,
        faceObj,
        pitchforkObj,
    )
        .merge({ objAngelBoyfriendsPuppet: api })
        .mixin(mxnFxVibrate)
        .step(() => {
            if (api.movementSpeed.x === 0 || api.movementSpeed.y !== 0) {
                pedometer = 0;
            }
            else {
                pedometer += Math.abs(api.movementSpeed.x);
            }
        })
        .step(() => {
            if (api.isExpressingPride) {
                bodiesSprite.texture = txPride;
            }
            else if (api.kissUnit > 0.9) {
                bodiesSprite.texture = txKiss;
            }
            else if (api.kissUnit > 0) {
                bodiesSprite.texture = txKissStart;
            }
            else if (api.movementSpeed.y !== 0) {
                bodiesSprite.texture = txMove;
            }
            else if (pedometer % 30 > 1 && pedometer % 30 < 16) {
                bodiesSprite.texture = txMove;
            }
            else {
                bodiesSprite.texture = txIdle;
            }

            faceObj.visible = bodyTexturesSupportingFace.has(bodiesSprite.texture);
        });
}
