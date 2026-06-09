import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [txTail, txBody, txFrill, txNoggin] = Tx.Characters.Flower.Layers.split({ width: 122 });

export function objCharacterFlower() {
    return container(
        Sprite.from(txTail).mixin(mxnSinePivot),
        Sprite.from(txBody),
        container(
            Sprite.from(txFrill),
            container(
                Sprite.from(txNoggin),
                objAngelEyes({
                    defaultEyelidRestingPosition: 0,
                    eyelidsTint: 0xEF9300,
                    gap: 8,
                    pupilRestStyle: {
                        kind: "cross_eyed",
                        offsetFromCenter: 4,
                    },
                    pupilsTx: Tx.Characters.Flower.Pupil,
                    scleraTx: Tx.Characters.Flower.Sclera,
                    pupilsTint: 0xC43337,
                })
                    .at(52, 36),
                objAngelMouth({
                    negativeSpaceTint: 0xC43337,
                    teethCount: 2,
                    toothGapWidth: 2,
                    txs: objAngelMouth.txs.rounded14,
                })
                    .at(52, 47),
            )
                .mixin(mxnFacingPivot, { left: -3, right: 3, down: 2, up: -2 }),
        )
            .mixin(mxnFacingPivot, { left: -5, right: 5, down: 3, up: -3 }),
    )
        .mixin(mxnDetectPlayer)
        .pivoted(53, 87)
        .zIndexed(ZIndex.Entities)
        .mixin(mxnSpeaker, { name: "Crazy Flower", tintPrimary: 0xC43337, tintSecondary: 0x8BCE27 });
}
