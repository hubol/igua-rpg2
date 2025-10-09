import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objAngelEyes } from "./obj-angel-eyes";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (function () {
    const Common = {
        textures: {
            body: Tx.Enemy.Chill.Body.split({ count: 3 }),
            head: Tx.Enemy.Chill.Head0,
            mouth: objAngelMouth.txs.w36,
            pupil: Tx.Enemy.Chill.Pupil0,
            sclera: Tx.Enemy.Chill.Sclera0,
        },
    };

    return {
        Common,
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 999,
        },
    }),
};

type Theme = typeof themes[keyof typeof themes];

export function objAngelChill() {
    const rank = ranks.level0;
    const theme = themes.Common;

    const bodyObj = objAngelChillBody(theme);

    const hurtboxes = [
        new Graphics().beginFill(0xff0000).drawRect(-50, -32, 100, 42).invisible(),
        new Graphics().beginFill(0xffff00).drawRect(-32, 10, 64, 48).invisible(),
    ];

    return container(bodyObj, objAngelChillHead(theme), ...hurtboxes)
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { hurtboxes, rank })
        .mixin(mxnEnemyDeathBurst, {
            primaryTint: 0xff0000,
            secondaryTint: 0x00ff00,
            tertiaryTint: 0x0000ff,
        })
        .pivoted(0, bodyObj.height - 3);
}

function objAngelChillBody(theme: Theme) {
    return container(
        Sprite.from(theme.textures.body[0]),
        Sprite.from(theme.textures.body[1]),
        Sprite.from(theme.textures.body[2]).mixin(mxnFacingPivot, { down: 1, up: -3, right: 3, left: -3 }),
    )
        .pivotedUnit(0.5, 0);
}

function objAngelChillHead(theme: Theme) {
    return container(
        container(
            Sprite.from(theme.textures.head).anchored(0.5, 0.8),
            container(
                objAngelMouth({
                    negativeSpaceTint: 0x000000,
                    teethCount: 3,
                    toothGapWidth: 2,
                    txs: theme.textures.mouth,
                })
                    .at(0, -8),
                objAngelEyes({
                    defaultEyelidRestingPosition: 6,
                    eyelidsTint: 0x0000ff,
                    gap: 20,
                    pupilRestStyle: {
                        kind: "cross_eyed",
                        offsetFromCenter: 5,
                    },
                    pupilTx: theme.textures.pupil,
                    scleraTx: theme.textures.sclera,
                })
                    .at(0, -24),
            )
                .mixin(mxnFacingPivot, { down: 6, up: -6, right: 6, left: -6 }),
        ),
    )
        .mixin(mxnFacingPivot, { down: 3, up: 0, right: 5, left: -5 });
}
