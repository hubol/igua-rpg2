import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const [txArmLow, txArmMiddle, txArmHigh, txTorso, txHead, txFaceDemo] = Tx.Enemy.Puller.Layers.split({ width: 50 });

const themes = (() => {
    const common = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xF291D8,
            gap: 5,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 0,
            },
            pupilsTint: 0x000000,
            pupilsTx: Tx.Enemy.Puller.Pupil,
            scleraTx: Tx.Enemy.Puller.Sclera,
        },
        mouth: {
            txs: objAngelMouth.txs.v7,
            negativeSpaceTint: 0x000000,
            teethCount: 1,
            toothGapWidth: 1,
        },
        sprites: {},
        tints: {},
    })
        .createTheme();

    return {
        common,
    };
})();

export function objAngelPuller() {
    const theme = themes.common;
    const armObj = objIndexedSprite([txArmLow, txArmMiddle, txArmHigh]);

    return container(
        armObj,
        Sprite.from(txTorso),
        container(
            Sprite.from(txHead),
            container(
                theme.createEyesObj(),
                theme.createMouthObj()
                    .coro(function* (self) {
                        self.controls.frowning = true;
                    })
                    .add(0, 5),
            )
                .add(29, 19)
                .mixin(mxnFacingPivot, { right: 8, left: -8, down: 2, up: -2 }),
        )
            .mixin(mxnFacingPivot, { right: 2, left: -2, down: 0, up: 0 }),
    )
        .pivoted(29, 53)
        .mixin(mxnDetectPlayer)
        .zIndexed(ZIndex.CharacterEntities);
}

const txsLever = Tx.Enemy.Puller.Lever.split({ count: 2 });

objAngelPuller.objLever = function objAngelPullerLever () {
    const api = {};

    return container(
        Sprite.from(txsLever[0]),
        Sprite.from(txsLever[1]),
    )
        .zIndexed(ZIndex.BackgroundEntities);
};
