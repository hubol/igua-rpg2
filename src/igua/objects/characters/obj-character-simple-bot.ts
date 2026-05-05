import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [txBody, txNoggin] = Tx.Characters.SimpleBot.split({ count: 2 });

export function objCharacterSimpleBot() {
    return container(
        Sprite.from(txBody),
        container(
            Sprite.from(txNoggin),
            container(
                objAngelMouth({
                    negativeSpaceTint: 0x715AC4,
                    teethCount: 3,
                    toothGapWidth: 3,
                    txs: objAngelMouth.txs.rounded14,
                })
                    .at(40, 34),
                objAngelEyes({
                    defaultEyelidRestingPosition: 0,
                    eyelidsTint: 0xA399C5,
                    gap: 20,
                    pupilRestStyle: {
                        kind: "cross_eyed",
                        offsetFromCenter: 3,
                    },
                    pupilsTint: 0x715AC4,
                    pupilsTx: Tx.Characters.SimpleBotPupil,
                    scleraTx: Tx.Characters.SimpleBotSclera,
                })
                    .at(40, 25),
            )
                .mixin(mxnFacingPivot, { up: -3, left: -3, down: 3, right: 3 }),
        ),
    )
        .pivoted(42, 77)
        .mixin(mxnDetectPlayer);
}
