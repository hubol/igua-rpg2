import { DisplayObject, Graphics } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { OneOrTwo } from "../../../lib/array/one-or-two";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interp, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ValuesOf } from "../../../lib/types/values-of";
import { ZIndex } from "../../core/scene/z-index";
import { mxnFxEmo } from "../../mixins/effects/mxn-fx-emo";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxEmoAura24px } from "../effects/obj-fx-emo-aura-24px";
import { playerObj } from "../obj-player";
import { objProjectileCircle } from "../projectiles/obj-projectile-circle";
import { objProjectileEvilSpirit } from "../projectiles/obj-projectile-evil-spirit";
import { objProjectileSadCloud } from "../projectiles/obj-projectile-sad-cloud";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelEyes } from "./obj-angel-eyes";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (function () {
    const [torsoTx, legsTx, armsTx] = Tx.Enemy.Chill.Body.split({ count: 3 });

    const template = AngelThemeTemplate.create(
        {
            eyes: {
                defaultEyelidRestingPosition: 6,
                eyelidsTint: 0xE02020,
                gap: 20,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 5,
                },
                pupilsTx: Tx.Enemy.Chill.Pupil0,
                pupilsTint: 0x000000,
                scleraTx: Tx.Enemy.Chill.Sclera0,
            },
            mouth: {
                negativeSpaceTint: 0x000000,
                teethCount: 3,
                toothGapWidth: 2,
                txs: objAngelMouth.txs.w36,
            },
            sprites: {
                torso: torsoTx,
                legs: legsTx,
                arms: armsTx,
                head: Tx.Enemy.Chill.Head0,
            },
            tints: {
                map: [0x990000, 0xff6600, 0xffd000] as MapRgbFilter.Map,
                pupils: [0x000000, 0x000000] as OneOrTwo<RgbInt>,
            },
        },
    );

    return {
        common: template.createTheme(),
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 999,
        },
        loot: {
            tier0: [
                { kind: "valuables", min: 100, max: 150, deltaPride: -10, weight: 30 },
                { kind: "pocket_item", count: 3, id: "ComputerChip", weight: 30 },
                { kind: "pocket_item", count: 5, id: "ComputerChip", weight: 20 },
                { kind: "flop", min: 59, max: 68, count: 5, weight: 20 },
            ],
            tier1: [
                { kind: "equipment", id: "NailFile", weight: 10 },
                { kind: "equipment", id: "PoisonRing", weight: 10 },
                { kind: "equipment", id: "RichesRing", weight: 10 },
                { kind: "equipment", id: "YellowRichesRing", weight: 10 },
                { kind: "potion", id: "RestoreHealth", count: 5, weight: 10 },
                { kind: "nothing", weight: 50 },
            ],
        },
    }),
};

type Feature = "shield" | "cry" | "vortex" | "evil_spirit";

type Theme = ValuesOf<typeof themes>;

const variants = {
    level0: {
        rank: ranks.level0,
        theme: themes.common,
        features: new Set<Feature>(["shield"]),
    },
    level1: {
        rank: ranks.level0,
        theme: themes.common,
        features: new Set<Feature>(["cry", "vortex", "evil_spirit"]),
    },
};

export function objAngelChill(entity: OgmoEntities.EnemyChill) {
    const { rank, theme, features } = variants[entity.values.variant] ?? variants.level0;

    const bodyObj = objAngelChillBody(theme);

    const hurtboxes = [
        new Graphics().beginFill(0xff0000).drawRect(-50, -32, 100, 42).invisible(),
        new Graphics().beginFill(0xffff00).drawRect(-32, 10, 64, 48).invisible(),
    ];

    const moves = {
        *summonEvilSpirit() {
            enemyObj.play(Sfx.Enemy.Chill.EvilSpiritSummon.rate(0.9, 1.1));
            const auraObj = objFxEmoAura24px().at(0, 32).show(enemyObj);
            const evilSpiritObj = objProjectileEvilSpirit(playerObj)
                .mixin(mxnRpgAttack, { attack: atkAoe, attacker: enemyObj.status })
                .at(enemyObj)
                .add(0, -32)
                .show();
            yield* Coro.all([
                interp(headObj.objAngelChillHead.mouthObj.mxnSpeakingMouth, "agapeUnit").to(1).over(333),
                sleep(Rng.int(1250, 2000)),
            ]);
            auraObj.destroy();
            evilSpiritObj.mxnDischargeable.charge();
            yield () => evilSpiritObj.mxnDischargeable.isDischarged;
            yield interp(headObj.objAngelChillHead.mouthObj.mxnSpeakingMouth, "agapeUnit").to(0).over(333);
        },
        *cry() {
            const auraObj = objFxEmoAura24px()
                .at(0, 32)
                .mixin(mxnSparkling)
                .show(enemyObj);
            auraObj.sparklesTint = 0x404069;
            auraObj.sparklesPerFrame = 0.2;

            const cloudObj = objProjectileSadCloud({
                target: enemyObj.mxnDetectPlayer,
                attack: atks.cryDrip,
                attacker: enemyObj.status,
            })
                .at(enemyObj)
                .coro(function* (self) {
                    yield () => self.objProjectileSadCloud.dripsCount >= 3 && !enemyObj.mxnDetectPlayer.isDetected;
                    yield* finish();
                });

            headObj.objAngelChillHead.mouthObj.controls.frowning = true;

            function* finish() {
                yield sleepf(0);
                if (isFinished()) {
                    return;
                }
                headObj.objAngelChillHead.mouthObj.controls.frowning = false;
                cloudObj.destroy();
                auraObj.destroy();
            }

            function isFinished() {
                return cloudObj.destroyed;
            }

            return {
                finish,
                isFinished,
            };
        },
        *emoVortex() {
            const vortexObj = objAngelChillEmoVortex()
                .mixin(mxnRpgAttack, { attack: atks.emoVortex, attacker: enemyObj.status })
                .at(enemyObj)
                .add(0, -430)
                .show();
            yield () => vortexObj.destroyed;
        },
        *shieldWithWeakpoint() {
            const leftAoeObj = new Graphics()
                .beginFill(0xff0000)
                .drawRect(0, 0, 32, 134)
                .at(-90, -134)
                .mixin(mxnRpgAttack, { attack: atkAoe, attacker: enemyObj.status })
                .mixin(mxnShield)
                .merge({ initialScale: vnew(1, 0) });

            const topAoeObj = new Graphics()
                .beginFill(0xff0000)
                .drawRect(-90, -134, 166, 32)
                .pivoted(76, 0)
                .at(76, 0)
                .mixin(mxnRpgAttack, { attack: atkAoe, attacker: enemyObj.status })
                .mixin(mxnShield)
                .merge({ initialScale: vnew(0, 1) });

            const rightAoeObj = new Graphics()
                .beginFill(0xff0000)
                .drawRect(55, -134, 32, 134)
                .mixin(mxnRpgAttack, { attack: atkAoe, attacker: enemyObj.status })
                .mixin(mxnShield)
                .merge({ initialScale: vnew(1, 0) });

            const rootObj = container(leftAoeObj, topAoeObj, rightAoeObj)
                .mixin(mxnFxEmo)
                .at(enemyObj)
                .show();

            const aoeObjs = [rightAoeObj, topAoeObj, leftAoeObj];
            const reversedAoeObjs = [...aoeObjs].reverse();

            for (const obj of aoeObjs) {
                obj.scale.at(obj.initialScale);
            }

            // TODO probably not while (true)
            while (true) {
                // TODO behavior switch for this
                if (enemyObj.mxnDetectPlayer.isDetected) {
                    yield* moves.summonEvilSpirit();
                }

                for (const obj of aoeObjs) {
                    enemyObj.play(Sfx.Enemy.Chill.Build.rate(0.95, 1.05));
                    yield interpv(obj.scale).factor(factor.sine).to(1, 1).over(1000);
                    yield sleep(1000);
                }

                rootObj.scale.x *= -1;
                rootObj.pivot.x = rootObj.scale.x < 0 ? -3 : 0;

                for (const obj of reversedAoeObjs) {
                    enemyObj.play(Sfx.Enemy.Chill.Unbuild.rate(0.95, 1.05));
                    yield interpv(obj.scale).to(obj.initialScale).over(1000);
                }

                yield* enemyObj.mxnRpgStatusPotions.dramaUseAppropriatePotion();
            }
        },
    };

    const soulAnchorObj = new Graphics().beginFill(0).drawRect(0, 0, 1, 1).at(0, 10).invisible();

    const headObj = objAngelChillHead(theme);
    const rgbObj = container(bodyObj, headObj, ...hurtboxes, soulAnchorObj)
        .filtered(new MapRgbFilter(...theme.tints.map));

    const enemyObj = container(rgbObj)
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { hurtboxes, rank, soulAnchorObj })
        .mixin(mxnEnemyDeathBurst, { map: theme.tints.map })
        .pivoted(0, bodyObj.height - 3)
        .coro(function* (self) {
            // TODO ehhh... weird switch
            if (features.has("shield")) {
                yield* moves.shieldWithWeakpoint();
            }

            while (true) {
                const cycleFeaturesSet = new Set(features);
                const remainingHealthUnit = self.status.health / self.status.healthMax;
                if (remainingHealthUnit < 0.5) {
                    cycleFeaturesSet.delete("cry");
                }

                for (const feature of Rng.shuffle([...cycleFeaturesSet])) {
                    yield () => self.mxnDetectPlayer.isDetected;
                    if (remainingHealthUnit < 0.5 && feature === "vortex") {
                        const cryMove = yield* moves.cry();
                        yield* moves.emoVortex();
                        yield* cryMove.finish();
                    }
                    else if (feature === "vortex") {
                        yield* moves.emoVortex();
                    }
                    else if (feature === "cry") {
                        const cryMove = yield* moves.cry();
                        yield* Coro.race([
                            cryMove.isFinished,
                            Coro.chain([
                                sleep(3000),
                                cryMove.finish(),
                            ]),
                        ]);
                    }
                    else if (feature === "evil_spirit") {
                        yield* moves.summonEvilSpirit();
                    }
                }
            }
        });

    return enemyObj;
}

function objAngelChillBody(theme: Theme) {
    return container(
        theme.createSprite("torso"),
        theme.createSprite("legs"),
        theme.createSprite("arms").mixin(mxnFacingPivot, { down: 1, up: -3, right: 3, left: -3 }),
    )
        .pivotedUnit(0.5, 0);
}

function objAngelChillHead(theme: Theme) {
    const mouthObj = theme.createMouthObj();
    const eyesObj = theme.createEyesObj();
    return container(
        container(
            theme.createSprite("head").anchored(0.5, 0.8),
            container(
                mouthObj.add(0, -8),
                eyesObj.add(0, -24),
            )
                .mixin(mxnFacingPivot, { down: 6, up: -6, right: 6, left: -6 }),
        ),
    )
        .mixin(mxnFacingPivot, { down: 3, up: 0, right: 5, left: -5 })
        .merge({ objAngelChillHead: { eyesObj, mouthObj } });
}

function objAngelChillEmoVortex() {
    return objProjectileCircle()
        .mixin(mxnFxEmo)
        .coro(function* (self) {
            yield* Coro.all([
                interpv(self.scale).to(100, 100).over(4000),
                interpvr(self).factor(factor.sine).translate(0, 350).over(4000),
            ]);
            yield sleep(333);
            yield interpv(self.scale).factor(factor.sine).to(0, 0).over(200);
            self.destroy();
        })
        .zIndexed(ZIndex.TerrainDecals);
}

function mxnShield(obj: DisplayObject) {
    return obj
        .mixin(mxnSparkling)
        .step((self) => {
            const hasScale = obj.scale.x !== 0 && obj.scale.y !== 0;
            self.sparklesPerFrame = hasScale ? 2 : 0;
            if (obj.is(mxnRpgAttack)) {
                obj.isAttackActive = hasScale;
            }
        });
}

const atkAoe = RpgAttack.create({
    emotional: 30,
});

const atks = {
    cryDrip: RpgAttack.create({
        emotional: 20,
        conditions: {
            wetness: {
                tint: 0xCECEE4,
                value: 10,
            },
        },
    }),
    emoVortex: RpgAttack.create({
        emotional: 90,
    }),
};
