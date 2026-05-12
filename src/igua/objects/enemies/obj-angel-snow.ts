import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
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
    level0: RpgEnemyRank.create({}),
};

export function objAngelSnow() {
    const rank = ranks.level0;
    const theme = themes.common;

    return container(
        theme.createSprite("leg"),
        theme.createSprite("leg").flipH(),
        theme.createSprite("body"),
        theme.createSprite("hat"),
        container(
            theme.createEyesObj(),
            theme.createMouthObj().at(0, 12),
        )
            .at(30, 27),
    )
        .mixin(mxnEnemy, { hurtboxes: [], rank })
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 1, physicsRadius: 8, physicsOffset: [0, -8] })
        .pivoted(30, 65);
}
