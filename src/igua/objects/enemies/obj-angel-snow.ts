import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
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
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xD1E5FF,
            gap: 5,
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

    return container(
        theme.createSprite("leg"),
        theme.createSprite("leg").flipH(),
        theme.createSprite("body"),
        theme.createSprite("hat"),
        container(
            theme.createEyesObj(),
            mouthObj.at(0, 12),
        )
            .at(30, 27),
        ...hurtboxObjs,
    )
        .mixin(mxnEnemy, { hurtboxes: hurtboxObjs, rank })
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 0.6, physicsRadius: 8, physicsOffset: [0, -8] })
        .pivoted(30, 65)
        .coro(function* (self) {
            while (true) {
                yield () => self.isOnGround && self.mxnDetectPlayer.isDetected;
                objFxExpressSurprise().at(self).add(0, -30).show();
                self.speed.y = -4;
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
                    .step(self => self.x += x)
                    .at(self)
                    .add(0, -64)
                    .show();

                yield interp(aoeObj.objProjectileSnowAoe, "radius").to(64).over(1000);
                aoeObj.mixin(mxnRpgAttack, { attack: atkSnowAoe, attacker: self.status });
                yield sleep(500);
                yield* Coro.all([
                    interp(mouthObj.mxnSpeakingMouth, "agapeUnit").to(0).over(250),
                    interp(aoeObj.objProjectileSnowAoe, "radius").to(0).over(1000),
                ]);
                aoeObj.destroy();
            }
        });
}

const atkSnowAoe = RpgAttack.create({
    physical: 100,
});
