import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const [
    txNoggin,
    txUnicorn,
    txDuocorn,
    txEars,
    txHair,
    txEyes,
    txNose,
    txMouth,
] = Tx.Enemy.Heatmeat.Head.split({ width: 56 });

const [
    txTorsoGrounded,
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
            txs: objAngelMouth.txs.w14,
        },
        sprites: {
            hair: txHair,
            horn: txUnicorn,
        },
        tints: {
            map: [0xFFB5E3, 0xFF3D50, 0xCD4423],
        },
    });

    return {
        heat: heatTemplate.createTheme(
            {},
            {
                sprites: {
                    hair: obj => obj.tinted(0x305DFF),
                },
            },
        ),
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

namespace themes {
    export type Id = keyof typeof themes;
}

export function objAngelHeatmeat(themeId: themes.Id) {
    const theme = themes[themeId];
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
                Sprite.from(txMouth),
            )
                .mixin(mxnFacingPivot, { up: -2, left: -2, down: 2, right: 2 }),
        )
            .mixin(mxnFacingPivot, { up: -3, left: -3, down: 3, right: 3 }),
    )
        .mixin(mxnDetectPlayer);
}
