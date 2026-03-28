import { Graphics, Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ValuesOf } from "../../../lib/types/values-of";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (() => {
    const template = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xff0000,
            gap: 8,
            pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 3 },
            pupilsTx: Tx.Enemy.Snail.Pupil0,
            pupilsTint: 0x000000,
            pupilsMirrored: true,
            scleraTx: Tx.Enemy.Snail.Sclera0,
            sclerasMirrored: true,
        },
        mouth: {
            teethCount: 2,
            toothGapWidth: 1,
            negativeSpaceTint: 0x000000,
            txs: objAngelMouth.txs.rounded14,
        },
        sprites: {
            nose: Tx.Enemy.Cactus.Nose,
        },
        tints: {
            map: [0x55B53B, 0xC9FF4A, 0xB20005] as MapRgbFilter.Map,
        },
    });

    return {
        common: template.createTheme(),
        berry: template.createTheme({
            eyes: {
                scleraTx: Tx.Enemy.Cactus.Sclera0,
                pupilsTx: Tx.Enemy.Miffed.Pupil1,
                gap: 10,
            },
            mouth: {
                txs: objAngelMouth.txs.rounded14,
            },
            sprites: {
                nose: Tx.Enemy.Cactus.Leaf0,
            },
            tints: {
                map: [0xB85BFF, 0xB8C2FF, 0x51AE70],
            },
        }, {
            eyes: (obj) => obj.add(0, 4),
            mouth: (obj) => obj.add(0, 6),
            sprites: {
                nose: (obj) => obj.add(8, -5).zIndexed(1),
            },
        }),
    };
})();

type Theme = ValuesOf<typeof themes>;

const [txCactusBody, ...txsCactusSpikes] = Tx.Enemy.Cactus.Body.split({ count: 4 });

const atks = {
    spikes: {
        strong: RpgAttack.create({
            physical: 60,
        }),
        weak: RpgAttack.create({
            physical: 25,
        }),
    },
};

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 80,
        },
        loot: {
            tier0: [
                { kind: "pocket_item", count: 1, id: "CactusFruitTypeA" },
                { kind: "pocket_item", count: 2, id: "CactusFruitTypeA" },
                { kind: "pocket_item", count: 1, id: "CactusFruitTypeB" },
                { kind: "pocket_item", count: 2, id: "CactusFruitTypeB" },
            ],
            tier1: [
                { kind: "valuables", deltaPride: 0, min: 25, max: 25, weight: 25 },
                { kind: "flop", min: 25, max: 29, weight: 25 },
                { kind: "potion", id: "Wetness", weight: 5 },
                { kind: "nothing", weight: 45 },
            ],
        },
    }),
    level1: RpgEnemyRank.create({
        status: {
            healthMax: 130,
        },
        loot: {
            tier0: [
                { kind: "valuables", min: 100, max: 150, deltaPride: -10 },
            ],
            tier1: [],
        },
        level: 100,
    }),
};

type Feature = "jumping" | "weak" | "berry";

const variants = {
    level0: {
        features: new Set<Feature>(),
        rank: ranks.level0,
        theme: themes.common,
    },
    level1: {
        features: new Set<Feature>(["jumping", "weak", "berry"]),
        rank: ranks.level1,
        theme: themes.berry,
    },
};

export function objAngelCactus(entity: OgmoEntities.EnemyCactus) {
    const { rank, theme, features } = variants[entity.values.variant] ?? variants.level0;

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(-23, -11, 43, 21)
        .invisible();

    const cactusSpikesObj = objAngelCactusSpikes();
    const mouthObj = theme.createMouthObj();

    const soulAnchorObj = new Graphics()
        .beginFill(0x000000)
        .drawRect(0, 0, 1, 1)
        .invisible();

    return container(
        container(
            Sprite.from(txCactusBody),
            cactusSpikesObj,
        )
            .pivoted(32, 27),
        soulAnchorObj,
        theme.createEyesObj()
            .add(0, -6)
            .zIndexed(2),
        mouthObj
            .add(0, 0)
            .zIndexed(2),
        theme.createSprite("nose")
            .anchored(0.5, 0.5)
            .add(-1, -4)
            .step(self => {
                let value = 0;
                if (mouthObj.controls.agapeUnit >= 1) {
                    value = 1;
                }
                if (mouthObj.controls.frowning) {
                    value = 2;
                }
                self.pivot.y = value;
            }),
        hurtboxObj,
    )
        .autoSorted()
        .pivoted(0, 10)
        .mixin(mxnPhysics, { physicsRadius: 10, gravity: 0.2, physicsOffset: [0, -13] })
        .handles("moved", (self, event) => {
            if (event.hitGround && event.previousSpeed.y !== 0) {
                self.speed.x = 0;
            }
        })
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { hurtboxes: [hurtboxObj], rank, soulAnchorObj })
        .mixin(mxnEnemyDeathBurst, { map: theme.tints.map })
        .filtered(new MapRgbFilter(...theme.tints.map))
        .coro(function* (self) {
            cactusSpikesObj
                .mixin(mxnRpgAttack, {
                    attacker: self.status,
                    attack: atks.spikes[features.has("weak") ? "weak" : "strong"],
                })
                .step(spikesObj => spikesObj.isAttackActive = spikesObj.objAngelCactusSpikes.scale >= 1);
        })
        .coro(function* (self) {
            yield sleep(Rng.int(250, 750));
            while (true) {
                self.play(Sfx.Enemy.Cactus.AttackCharge.rate(0.99, 1.01));
                mouthObj.controls.frowning = true;
                const vibrateObj = container()
                    .coro(function* () {
                        while (true) {
                            for (let i = 0; i <= 1; i++) {
                                self.pivot.x = i;
                                yield sleepf(4);
                            }
                        }
                    })
                    .show(self);
                yield sleep(500);
                yield interp(mouthObj.controls, "agapeUnit").to(1).over(50);
                let doubleJump = false;
                const jumpHorizontalSpeed = Math.sign(self.mxnDetectPlayer.position.x - self.x) * 2;
                vibrateObj.destroy();
                if (features.has("jumping") && self.mxnDetectPlayer.detectionScore > 0) {
                    self.speed.x = jumpHorizontalSpeed;
                    self.speed.y = -2;
                    doubleJump = Math.abs(self.mxnDetectPlayer.position.x - self.x) < 170;
                }
                mouthObj.controls.frowning = doubleJump;
                self.play(Sfx.Enemy.Cactus.SpikesExpose.rate(0.9, 1.1));
                yield interp(cactusSpikesObj.objAngelCactusSpikes, "scale").to(1).over(250);
                if (doubleJump) {
                    yield () => self.isOnGround;
                    self.speed.x = jumpHorizontalSpeed;
                    self.speed.y = -2;
                    self.play(Sfx.Enemy.Cactus.SpikesExpose.rate(1.4, 1.6));
                    yield () => self.speed.y === 0 && self.isOnGround;
                    mouthObj.controls.frowning = false;
                }
                yield sleep(Rng.int(500, 1500));
                self.play(Sfx.Enemy.Cactus.SpikesRetract.rate(0.9, 1.1));
                yield interp(cactusSpikesObj.objAngelCactusSpikes, "scale").to(0).over(250);
                yield interp(mouthObj.controls, "agapeUnit").to(0).over(250);
                yield sleep(Rng.int(500, 1500));
                if (features.has("berry")) {
                    yield* self.mxnRpgStatusBerry.dramaSpawnBerry();
                }
            }
        });
}

function objAngelCactusSpikes() {
    const api = {
        scale: 0,
    };

    const collisionShapeObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, 61, 43)
        .scaled(0, 0)
        .invisible();

    const sprite = objIndexedSprite(txsCactusSpikes)
        .step(self => {
            self.textureIndex = txsCactusSpikes.length * api.scale;
            collisionShapeObj.scale.set(self.effectiveTextureIndex >= (txsCactusSpikes.length - 1) ? 1 : 0);
            self.visible = api.scale > 0;
        });

    return container(
        sprite,
        collisionShapeObj,
    )
        .collisionShape(CollisionShape.DisplayObjects, [collisionShapeObj])
        .merge({ objAngelCactusSpikes: api });
}
