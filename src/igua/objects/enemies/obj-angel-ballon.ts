import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { FxPattern } from "../effects/lib/fx-pattern";
import { objFxBallon } from "../effects/obj-fx-ballon";
import { objFxHelium } from "../effects/obj-fx-helium";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const [txBallonNoggin, ...txsBallonShine] = Tx.Enemy.Ballon.Noggin.split({ width: 44 });

const themes = (() => {
    const template = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0x800000,
            gap: 6,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 2,
            },
            pupilsTint: 0x00ff00,
            pupilsTx: Tx.Enemy.Ballon.Pupil,
            scleraTx: Tx.Enemy.Ballon.Sclera,
            sclerasMirrored: true,
            pupilsMirrored: true,
        },
        mouth: {
            negativeSpaceTint: 0x000000,
            teethCount: 3,
            toothGapWidth: 1,
            txs: objAngelMouth.txs.w18,
        },
        sprites: {
            noggin: txBallonNoggin,
            nose: Tx.Enemy.Ballon.Nose,
        },
        tints: {},
    });

    return {
        ohio: template.createTheme(
            {},
            {
                sprites: {
                    nose: (obj) => obj.tinted(0x0000ff),
                },
            },
        ),
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 25,
        },
    }),
};

const variants = {
    level0: {
        theme: themes.ohio,
        rank: ranks.level0,
    },
};

export function objAngelBallon() {
    const { theme, rank } = variants.level0;
    const hurtboxObj = new Graphics()
        .beginFill(0x000000)
        .drawRect(-19, -20, 38, 34)
        .invisible();

    let targetSpeed = down;

    const shineObj = objIndexedSprite(txsBallonShine);
    shineObj.alpha = 0.67;

    const tints = objFxBallon.getTints(Rng.intc(999_999_999));

    return container(
        theme.createSprite("noggin")
            .anchored(0.5, 0.5),
        shineObj
            .anchored(0.5, 0.5)
            .scaled(1, -1)
            .add(0, -8),
        container(
            theme.createMouthObj()
                .add(0, 19),
            theme.createEyesObj()
                .add(0, 8),
            theme.createSprite("nose")
                .anchored(0.5, 0.5)
                .add(0, 10),
        )
            .add(0, -22),
        hurtboxObj,
    )
        .filtered(new MapRgbFilter(tints.rubber, tints.face, tints.face))
        .mixin(mxnEnemy, { rank, hurtboxes: [hurtboxObj] })
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 16 })
        .handles("damaged", (self, value) => {
            if (!value.rejected) {
                const burstObj = objAngelBallonHeliumBurst("small")
                    .at(self)
                    .show();

                if (value.impactSpeed) {
                    self.speed.add(value.impactSpeed);
                    const offset = vnew(value.impactSpeed).normalize().scale(-16);
                    burstObj.add(offset);
                }
            }
        })
        .handles("mxnEnemy.died", (self) => {
            objAngelBallonHeliumBurst("large")
                .at(self)
                .show();
        })
        .step(self => {
            self.speed.moveTowards(targetSpeed, 0.05);
            shineObj.textureIndex = Math.round(Math.sin(self.x * 0.1 + self.y * 0.1) + 1);
        })
        .coro(function* (self) {
            let groundY = self.y;

            while (true) {
                yield () => self.isOnGround || self.y >= groundY;
                groundY = Math.min(self.y, groundY);
                targetSpeed = up;
                yield sleepf(64);
                targetSpeed = down;
            }
        });
}

const heliumAtks = {
    small: RpgAttack.create({
        conditions: {
            helium: 20,
        },
    }),
    large: RpgAttack.create({
        conditions: {
            helium: 100,
        },
    }),
};

function objAngelBallonHeliumBurst(size: keyof typeof heliumAtks) {
    const attack = heliumAtks[size];
    const count = size === "small" ? 2 : 10;
    const radius = size === "small" ? 8 : 18;

    const maskObj = new Graphics().beginFill(0x000000).drawCircle(0, 0, radius * 2).invisible();

    return container(
        maskObj,
        ...FxPattern.getRadialBurst({ count, radius })
            .map(node => objFxHelium().at(node.position)),
    )
        .mixin(mxnRpgAttack, { attack, damageTargetsOnce: true })
        .collisionShape(CollisionShape.Children)
        .coro(function* (self) {
            yield () => self.children.length === 1;
            self.destroy();
        });
}

const down = vnew(0, 0.3);
const up = vnew(0, -0.6);
