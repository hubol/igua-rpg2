import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
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
        tints: {
            map: [0xff0000, 0x00ff00, 0x0000ff] as MapRgbFilter.Map,
        },
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

    return container(
        theme.createSprite("noggin")
            .anchored(0.5, 0.5),
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
        .filtered(new MapRgbFilter(...theme.tints.map))
        .mixin(mxnEnemy, { rank, hurtboxes: [hurtboxObj] })
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 16 })
        .handles("damaged", (self, value) => {
            if (!value.rejected && value.impactSpeed) {
                self.speed.add(value.impactSpeed);
            }
        })
        .step(self => self.speed.moveTowards(targetSpeed, 0.05))
        .coro(function* (self) {
            while (true) {
                yield () => self.isOnGround;
                targetSpeed = up;
                yield sleepf(64);
                targetSpeed = down;
            }
        });
}

const down = vnew(0, 0.3);
const up = vnew(0, -0.6);
