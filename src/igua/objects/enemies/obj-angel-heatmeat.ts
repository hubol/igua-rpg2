import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const [
    txNoggin,
    txUnicorn,
    txDuocorn,
    txEars,
    txHair,
    _,
    txNose,
    __,
] = Tx.Enemy.Heatmeat.Head.split({ width: 56 });

const [
    ___,
    txTorsoAirborne,
] = Tx.Enemy.Heatmeat.Torso.split({ width: 56 });

const txsArms = Tx.Enemy.Heatmeat.Arms.split({ width: 56 });

const themes = (() => {
    const heatTemplate = AngelThemeTemplate.create({
        // TODO not used yet
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xFFB5E3,
            gap: 9,
            pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 0 },
            pupilsTx: Tx.Enemy.Heatmeat.PupilSad,
            pupilsTint: 0x000000,
            pupilsMirrored: true,
            scleraTx: Tx.Enemy.Heatmeat.ScleraSad,
            sclerasMirrored: true,
        },
        // TODO not used yet
        mouth: {
            negativeSpaceTint: 0x000000,
            teethCount: 2,
            toothGapWidth: 1,
            txs: objAngelMouth.txs.rounded14b,
        },
        sprites: {
            hair: txHair,
            horn: txUnicorn,
        },
        tints: {
            burstMap: [0xFFB5E3, 0xCD4423, 0x305DFF] as MapRgbFilter.Map,
            map: [0xFFB5E3, 0xFF3D50, 0xCD4423] as MapRgbFilter.Map,
        },
    }, {
        sprites: {
            hair: obj => obj.tinted(0x305DFF),
        },
    });

    return {
        heat: heatTemplate.createTheme(),
        meat: heatTemplate.createTheme(
            {
                eyes: {
                    pupilsTx: Tx.Enemy.Heatmeat.PupilAngry,
                    scleraTx: Tx.Enemy.Heatmeat.ScleraAngry,
                },
                sprites: {
                    horn: txDuocorn,
                },
                tints: {
                    burstMap: [0xFFB5E3, 0x657823, 0x00DB19],
                    map: [0xFFB5E3, 0xFF3D50, 0x657823],
                },
            },
            {
                eyes: obj => obj.add(0, -1),
                sprites: {
                    hair: obj => obj.tinted(0x00DB19),
                },
            },
        ),
    };
})();

const ranks = {
    heat: RpgEnemyRank.create({}),
    meat: RpgEnemyRank.create({}),
};

const variants = {
    heat: {
        rank: ranks.heat,
        theme: themes.heat,
    },
    meat: {
        rank: ranks.meat,
        theme: themes.meat,
    },
};

namespace variants {
    export type Id = keyof typeof variants;
}

export function objAngelHeatmeat(variantId: variants.Id) {
    const { rank, theme } = variants[variantId];

    const hurtboxObjs = [
        new Graphics().beginFill(0xff0000).drawRect(6, 17, 43, 25),
        new Graphics().beginFill(0xff0000).drawRect(15, 37, 25, 44),
    ]
        .map(obj => obj.invisible());

    return container(
        container(
            Sprite.from(txsArms[0]),
            Sprite.from(txTorsoAirborne),
            container(
                Sprite.from(txNoggin),
                Sprite.from(txEars),
            )
                .mixin(mxnFacingPivot, { up: -3, left: -3, down: 3, right: 3 }),
        )
            .filtered(new MapRgbFilter(...theme.tints.map)),
        container(
            theme.createSprite("horn"),
            theme.createSprite("hair"),
            container(
                theme.createEyesObj()
                    .add(27, 27),
                Sprite.from(txNose),
                theme.createMouthObj()
                    .add(27, 35),
            )
                .mixin(mxnFacingPivot, { up: -2, left: -2, down: 2, right: 2 }),
        )
            .mixin(mxnFacingPivot, { up: -3, left: -3, down: 3, right: 3 }),
        ...hurtboxObjs,
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { hurtboxes: hurtboxObjs, rank })
        .mixin(mxnEnemyDeathBurst, { map: theme.tints.burstMap });
}
