import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxExpressSurprise } from "../effects/obj-fx-express-surprise";
import { objProjectileSnowAoe } from "../projectiles/obj-projectile-snow-aoe";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (() => {
    const [txLeg, txBody, txHat] = Tx.Enemy.Snow.Body.split({ count: 3 });

    const template = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 10,
            eyelidsTint: 0xD1E5FF,
            gap: 7,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 3,
            },
            pupilsTint: 0xE2502F,
            pupilsTx: Tx.Enemy.Snow.Pupil,
            scleraTx: Tx.Enemy.Snow.Sclera,
            sclerasMirrored: true,
        },
        mouth: {
            negativeSpaceTint: 0xE2502F,
            teethCount: 2,
            toothGapWidth: 2,
            txs: objAngelMouth.txs.rounded11,
        },
        sprites: {
            leg: txLeg,
            body: txBody,
            hat: txHat,
        },
        tints: {},
    });

    return {
        common: template.createTheme(),
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 200,
            defenses: {
                physical: 99,
            },
            conditions: {
                poison: {
                    immune: true,
                },
            },
        },
    }),
};

export function objAngelSnow() {
    const rank = ranks.level0;
    const theme = themes.common;

    const hurtboxObjs = [
        new Graphics().beginFill(0xff0000).drawRect(8, 15, 43, 50),
    ]
        .map(obj => obj.invisible());

    const mouthObj = theme.createMouthObj();

    const leftLegObj = theme.createSprite("leg");
    const rightLegObj = theme.createSprite("leg").flipH();

    const bodyObj = container(
        theme.createSprite("body"),
        theme.createSprite("hat"),
        container(
            theme.createEyesObj(),
            mouthObj.at(0, 13),
        )
            .mixin(mxnFacingPivot, { down: 1, left: -4, right: 4, up: -2 })
            .at(30, 27),
    );

    let legPhase = 0;

    return container(
        leftLegObj,
        rightLegObj,
        bodyObj,
        ...hurtboxObjs,
    )
        .mixin(mxnEnemy, { hurtboxes: hurtboxObjs, rank })
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 0.3, physicsRadius: 8, physicsOffset: [0, -8] })
        .pivoted(30, 65)
        .coro(function* (self) {
            while (true) {
                yield () => self.isOnGround && self.mxnDetectPlayer.isDetected;
                objFxExpressSurprise().at(self).add(0, -30).show();
                self.speed.y = -3;
                yield () => self.speed.y === 0 && self.isOnGround;

                while (true) {
                    if (!self.mxnDetectPlayer.isDetected) {
                        break;
                    }

                    const dir = Math.sign(self.mxnDetectPlayer.relativePosition.x);

                    yield interp(self.speed, "x").to(dir).over(333);

                    yield* Coro.race([
                        () => Math.sign(self.mxnDetectPlayer.relativePosition.x) !== dir,
                        () => self.mxnDetectPlayer.relativePosition.vlength < 64,
                        sleep(2000),
                    ]);

                    yield interp(self.speed, "x").to(0).over(500);
                }
            }
        })
        .coro(function* (self) {
            while (true) {
                yield sleep(1000);

                yield interp(mouthObj.mxnSpeakingMouth, "agapeUnit").to(1).over(250);

                const x = Math.sign(self.speed.x);
                const aoeObj = objProjectileSnowAoe(0)
                    .mixin(mxnRpgAttack, { attack: atkSnowAoe, attacker: self.status })
                    .step(self => self.x += x)
                    .at(self)
                    .add(0, -64)
                    .show();

                aoeObj.isAttackActive = false;
                yield interp(aoeObj.objProjectileSnowAoe, "radius").to(64).over(1000);
                aoeObj.isAttackActive = true;
                yield sleep(500);
                yield* Coro.all([
                    interp(mouthObj.mxnSpeakingMouth, "agapeUnit").to(0).over(250),
                    interp(aoeObj.objProjectileSnowAoe, "radius").to(0).over(1000),
                ]);
                aoeObj.destroy();
            }
        })
        .step((self) => {
            if (self.speed.isZero) {
                leftLegObj.y = approachLinear(leftLegObj.y, 0, 3);
                rightLegObj.y = approachLinear(rightLegObj.y, 0, 3);
            }
            else if (scene.ticker.ticks % 2 === 0) {
                const leftTargetY = legPhase % 2 === 0 ? -6 : 0;
                const rightTargetY = legPhase % 2 === 0 ? 0 : -6;

                leftLegObj.y = approachLinear(leftLegObj.y, leftTargetY, 1);
                rightLegObj.y = approachLinear(rightLegObj.y, rightTargetY, 1);

                if (self.speed.x !== 0 && leftLegObj.y === leftTargetY && rightLegObj.y === rightTargetY) {
                    legPhase += 1;
                }
            }

            bodyObj.y = leftLegObj.y < -4 || rightLegObj.y < -4 ? 1 : 0;
        });
}

const atkSnowAoe = RpgAttack.create({
    physical: 100,
});
