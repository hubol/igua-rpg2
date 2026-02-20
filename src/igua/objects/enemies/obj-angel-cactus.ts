import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { ValuesOf } from "../../../lib/types/values-of";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
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
            eyelidsTint: 0x55B53B,
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
        tints: {},
    });

    return {
        common: template.createTheme(),
    };
})();

type Theme = ValuesOf<typeof themes>;

const [txCactusBody, ...txsCactusSpikes] = Tx.Enemy.Cactus.Body.split({ count: 4 });

const atkSpikes = RpgAttack.create({
    physical: 60,
});

export function objAngelCactus() {
    const theme = themes.common;
    const rank = RpgEnemyRank.create({
        status: {
            healthMax: 80,
            guardingDefenses: {
                physical: 100,
            },
        },
    });

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(-23, -11, 43, 21)
        .invisible();

    const cactusSpikesObj = objAngelCactusSpikes();
    const mouthObj = theme.createMouthObj();

    return container(
        container(
            Sprite.from(txCactusBody),
            cactusSpikesObj,
        )
            .pivoted(32, 27),
        theme.createEyesObj()
            .add(0, -6),
        mouthObj
            .add(0, 0),
        theme.createSprite("nose")
            .anchored(0.5, 0.5)
            .add(-1, -4)
            .step(self => self.pivot.y = mouthObj.mxnSpeakingMouth.agapeUnit >= 1 ? 1 : 0),
        hurtboxObj,
    )
        .pivoted(0, 10)
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { hurtboxes: [hurtboxObj], rank })
        .coro(function* (self) {
            cactusSpikesObj
                .mixin(mxnRpgAttack, { attacker: self.status, attack: atkSpikes })
                .step(spikesObj => spikesObj.isAttackActive = spikesObj.objAngelCactusSpikes.scale >= 1);
        })
        .coro(function* (self) {
            yield sleep(Rng.int(250, 750));
            while (true) {
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
                yield interp(mouthObj.mxnSpeakingMouth, "agapeUnit").to(1).over(50);
                vibrateObj.destroy();
                yield interp(cactusSpikesObj.objAngelCactusSpikes, "scale").to(1).over(250);
                yield sleep(Rng.int(500, 1500));
                yield interp(cactusSpikesObj.objAngelCactusSpikes, "scale").to(0).over(250);
                yield interp(mouthObj.mxnSpeakingMouth, "agapeUnit").to(0).over(250);
                yield sleep(Rng.int(500, 1500));
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
