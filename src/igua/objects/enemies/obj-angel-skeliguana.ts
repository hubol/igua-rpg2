import { DisplayObject, Graphics } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { blendColor } from "../../../lib/color/blend-color";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { nlerp } from "../../../lib/math/number";
import { Integer, Polar } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { ZIndex } from "../../core/scene/z-index";
import { DataNpcLooks } from "../../data/data-npc-looks";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxExpressSurprise } from "../effects/obj-fx-express-surprise";
import { objFxRipple } from "../effects/obj-fx-ripple";
import { objIguanaLocomotive } from "../obj-iguana-locomotive";
import { objProjectileCrackedEarthExpanding } from "../projectiles/obj-projectile-cracked-earth-expanding";
import { objProjectileFlameOrb } from "../projectiles/obj-projectile-flame-orb";
import { objAngelSkull } from "./obj-angel-skull";

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 30,
            conditions: {
                overheat: {
                    max: 70,
                },
            },
        },
        loot: {
            tier0: [{ kind: "pocket_item", id: "BoneTypeA" }],
            tier1: [
                { kind: "equipment", id: "BoneCoin", weight: 3 },
                { kind: "equipment", id: "EctoplasmStreak", weight: 2 },
                { kind: "equipment", id: "RichesRing", weight: 1 },
                { kind: "nothing", weight: 94 },
            ],
        },
    }),
    level1: RpgEnemyRank.create({
        status: {
            healthMax: 66,
        },
        loot: {
            tier0: [
                { kind: "pocket_item", id: "BoneTypeA", count: 7, weight: 50 },
                { kind: "pocket_item", id: "BoneTypeA", count: 10, weight: 30 },
                { kind: "pocket_item", id: "BoneTypeA", count: 12, weight: 20 },
            ],
            tier1: [
                { kind: "equipment", id: "BoneCoin", weight: 6 },
                { kind: "equipment", id: "EctoplasmStreak", weight: 4 },
                { kind: "equipment", id: "YellowRichesRing", weight: 2 },
                { kind: "nothing", weight: 88 },
            ],
        },
    }),
    level2: RpgEnemyRank.create({
        status: {
            healthMax: 99,
        },
        loot: {
            tier0: [
                { kind: "pocket_item", id: "BoneTypeA", count: 9, weight: 50 },
                { kind: "pocket_item", id: "BoneTypeA", count: 12, weight: 30 },
                { kind: "pocket_item", id: "BoneTypeA", count: 15, weight: 20 },
            ],
            tier1: [
                { kind: "equipment", id: "EctoplasmStreak", weight: 10 },
                { kind: "equipment", id: "BoneCoin", weight: 6 },
                { kind: "equipment", id: "YellowRichesRing", weight: 2 },
                { kind: "equipment", id: "RichesRing", weight: 2 },
                { kind: "nothing", weight: 80 },
            ],
        },
    }),
};

type Feature = "overheat_trail" | "fire_breath" | "throw_skull";

const variants = {
    level0: {
        rank: ranks.level0,
        features: new Set<Feature>(["overheat_trail"]),
        looks: DataNpcLooks.Skeleton0,
    },
    level1: {
        rank: ranks.level1,
        features: new Set<Feature>(["fire_breath"]),
        looks: DataNpcLooks.Skeleton1,
    },
    level2: {
        rank: ranks.level2,
        features: new Set<Feature>(["fire_breath", "throw_skull"]),
        looks: DataNpcLooks.Skeleton2,
    },
};

const atks = {
    overheatTrail: RpgAttack.create({
        conditions: {
            overheat: {
                value: 5,
                damage: 30,
            },
        },
    }),
    fireBreath: RpgAttack.create({
        physical: 50,
    }),
    skullExplode: RpgAttack.create({
        physical: 70,
    }),
};

export function objAngelSkeliguana(variantId: keyof typeof variants) {
    const { rank, features, looks } = variants[variantId];

    const featuresDetectPlayer = features.has("fire_breath") || features.has("throw_skull");

    const hurtboxObjs = new Array<DisplayObject>();
    let sinceDamagedStepsCount = 999;
    let isBreathingFire = false;

    const locomotiveObj = objIguanaLocomotive(looks);
    const soulAnchorObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, 1, 1)
        .at(0, -16)
        .invisible()
        .show(locomotiveObj);

    const obj = locomotiveObj
        .mixin(mxnEnemy, { rank, hurtboxes: hurtboxObjs, soulAnchorObj })
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemyDeathBurst, { map: [0xffffff, 0xE8E3E3, 0xbdbdbd] });

    const moves = {
        *idle() {
            obj.walkingTopSpeed = 1;
            let left = Rng.bool();

            for (let i = 0; i < 2; i++) {
                obj.auto.facing = left ? -1 : 1;

                yield sleep(200);

                obj.isMovingLeft = left;
                obj.isMovingRight = !left;

                let hitWall = false;

                yield* Coro.race([
                    Coro.chain([obj.mxnPhysics.dramaHitWall(), () => hitWall = true]),
                    sleep(Rng.int(2000, 3000)),
                ]);

                if (hitWall && i === 0) {
                    left = !left;
                    continue;
                }

                obj.isMovingLeft = false;
                obj.isMovingRight = false;

                yield sleep(Rng.int(333, 666));
            }
        },
        *expressSurprise() {
            objFxExpressSurprise()
                .at(obj.head.getWorldCenter())
                .show();

            obj.isMovingLeft = false;
            obj.isMovingRight = false;
            obj.auto.facing = Math.sign(obj.mxnDetectPlayer.relativePosition.x);
            obj.speed.y = -1.6;
            yield () => obj.speed.y >= 0 && obj.isOnGround;
        },
        *breatheFire() {
            const dx = Math.sign(obj.mxnDetectPlayer.relativePosition.x);
            obj.auto.facing = dx;

            yield () => obj.facing === dx;

            const mouthObj = obj.head.mouth;

            for (let i = 0; i < 3; i++) {
                obj.play(Sfx.Enemy.Skeliguana.BreatheFireStart.rate(0.99, 1.01));

                const healthBeforeThisBreath = obj.status.health;

                isBreathingFire = true;

                const rippleObj = objFxRipple({
                    radius: 16,
                    stroke: 0,
                    tint: 0x8b2214,
                }, {
                    radius: 1,
                    stroke: 4,
                    tint: 0xf1dc1c,
                })
                    .mxnFxFactor.play(333)
                    .at(mouthObj.getWorldCenter())
                    .show();

                yield () => rippleObj.destroyed;

                for (let f = 0; f < 1; f += 0.05) {
                    if (Rng.float() < 0.3) {
                        obj.play(Sfx.Enemy.Skeliguana.FireOrb.rate(1 + f + Rng.float(-0.1, 0.1)));
                    }

                    const orbObj = objProjectileFlameOrb(
                        blendColor(0x8b2214, 0xf1dc1c, f),
                        blendColor(0x575757, 0x909090, Rng.float()),
                    )
                        .mixin(mxnRpgAttack, { attack: atks.fireBreath, attacker: obj.status })
                        .at(mouthObj.getWorldCenter())
                        .show();

                    orbObj.speed.at(
                        nlerp(dx * 1, dx * 4, f),
                        nlerp(-1, -3, f),
                    );

                    yield sleepf(3);

                    if (obj.status.health < healthBeforeThisBreath) {
                        break;
                    }
                }

                isBreathingFire = false;

                const tookDamage = obj.status.health < healthBeforeThisBreath;
                const distanceToPlayerX = Math.abs(obj.mxnDetectPlayer.relativePosition.x);

                if (!tookDamage && features.has("throw_skull") && distanceToPlayerX > 90) {
                    yield sleep(200);
                    yield* moves.throwSkull();
                }

                const speedLevel = tookDamage ? 1 : 0;

                const walkDistance = tookDamage
                    ? Rng.int(60, 100)
                    : Math.min(Math.max(1, distanceToPlayerX - 50), 120);

                const staggered = yield* obj.mxnEnemy.dramaStagger(
                    (isStaggered) =>
                        Coro.race([
                            moves.walkTowards(
                                dx * (tookDamage ? -1 : 1),
                                speedLevel,
                                walkDistance,
                            ),
                            isStaggered,
                        ]),
                );

                if (staggered) {
                    yield* moves.walkTowards(dx * -1, speedLevel + 1, 90);
                }

                obj.isMovingLeft = false;
                obj.isMovingRight = false;

                if (tookDamage || staggered) {
                    break;
                }
            }
        },
        *walkTowards(dx: Polar, speedLevel: Integer, distance: number) {
            obj.walkingTopSpeed = 1 + speedLevel * 1.5;
            obj.isMovingLeft = dx < 0;
            obj.isMovingRight = !obj.isMovingLeft;

            const walkSteps = Math.ceil(Math.abs(distance) / obj.walkingTopSpeed);

            yield* Coro.race([
                Coro.chain([
                    obj.mxnPhysics.dramaHitWall(),
                    () => (obj.speed.y = -3, true),
                    () => obj.speed.y >= 0 && obj.isOnGround,
                ]),
                holdf(() => obj.isOnGround, walkSteps),
            ]);
        },
        *throwSkull() {
            obj.isMovingLeft = false;
            obj.isMovingRight = false;

            const remainingHealthUnit = obj.status.health / obj.status.healthMax;
            const count = Rng.float() > remainingHealthUnit ? 2 : 1;

            for (let i = 0; i < count; i++) {
                yield () => obj.isOnGround;

                const dir = Math.sign(obj.mxnDetectPlayer.relativePosition.x) || obj.facing;
                obj.auto.facing = dir;
                obj.speed.y = -2;

                obj.play(Sfx.Enemy.Skeliguana.Throw.rate(0.9, 1.1));

                const skullObj = objAngelSkull({ attacker: obj.status, attack: atks.skullExplode })
                    .at(obj)
                    .add(0, -30)
                    .show();

                skullObj.speed.x = dir * (i === 0 ? 4 : 2);
                skullObj.speed.y = i === 0 ? -3 : -3;

                yield () => obj.speed.y >= 0 && obj.isOnGround;
            }
        },
    };

    obj.auto.facingMode = "check_moving";

    return obj
        .handles("damaged", (_, event) => {
            if (event.rejected) {
                return;
            }

            sinceDamagedStepsCount = 0;
        })
        .coro(function* (self) {
            self.mxnIguanaSprites.isSkeleton = true;
            hurtboxObjs.push(self.head, self.body);
        })
        .step(() => sinceDamagedStepsCount++)
        .coro(function* (self) {
            while (true) {
                yield () => sinceDamagedStepsCount < 30 || isBreathingFire;
                if (!isBreathingFire) {
                    self.head.mouth.emote.sad();
                }
                yield interp(self.head.mouth, "agape").to(1).over(200);
                yield () => sinceDamagedStepsCount > 30 && !isBreathingFire;
                yield interp(self.head.mouth, "agape").to(0).over(200);
                self.head.mouth.emote.clear();
            }
        })
        .coro(function* (self) {
            if (featuresDetectPlayer) {
                return;
            }

            while (true) {
                yield* moves.idle();
            }
        })
        .coro(function* (self) {
            if (!featuresDetectPlayer) {
                return;
            }

            while (true) {
                if (!self.mxnDetectPlayer.isDetected) {
                    yield* Coro.race([
                        moves.idle(),
                        () => self.mxnDetectPlayer.isDetected,
                    ]);

                    if (!self.mxnDetectPlayer.isDetected) {
                        continue;
                    }

                    yield* moves.expressSurprise();
                }

                if (features.has("throw_skull") && Math.abs(self.mxnDetectPlayer.relativePosition.x) > 50) {
                    yield* moves.throwSkull();
                }

                if (features.has("fire_breath")) {
                    yield* moves.breatheFire();
                }
            }
        })
        .coro(function* (self) {
            if (!features.has("overheat_trail")) {
                return;
            }

            while (true) {
                yield () => self.isOnGround;

                const trailObj = objProjectileCrackedEarthExpanding({
                    attacker: self.status,
                    attack: atks.overheatTrail,
                    maxWidth: 100,
                    expandDirection: "both",
                    expandSpeed: 10,
                })
                    .at(self)
                    .add(0, -3)
                    .zIndexed(ZIndex.TerrainDecals)
                    .show();

                trailObj.visible = false;

                yield* Coro.race([
                    sleep(100),
                    () => trailObj.findIs(mxnRpgAttack).length > 0,
                ]);

                const attackObj = trailObj.findIs(mxnRpgAttack)[0];

                if (!attackObj) {
                    continue;
                }

                attackObj.isAttackActive = false;

                yield sleep(200);

                trailObj.visible = true;
                attackObj.isAttackActive = true;
                trailObj
                    .mixin(mxnDestroyAfterSteps, 90);

                yield sleep(500);

                trailObj.alpha = 0.7;
            }
        })
        .zIndexed(ZIndex.CharacterEntities);
}
