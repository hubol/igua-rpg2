import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnShadowFloor } from "../../mixins/mxn-shadow-floor";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [txTorso, txNoggin] = Tx.Characters.MrIndiana.Layers.split({ count: 2 });

export function objCharacterMrIndiana() {
    return container(
        Sprite.from(txTorso),
        container(
            Sprite.from(txNoggin),
            objAngelEyes({
                defaultEyelidRestingPosition: 0,
                eyelidsTint: 0x698826,
                gap: 5,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 0,
                },
                pupilsTint: 0x698826,
                pupilsTx: Tx.Characters.MrIndiana.Pupil,
                scleraTx: Tx.Characters.MrIndiana.Sclera,
            })
                .at(33, 25),
            objAngelMouth({
                negativeSpaceTint: 0x698826,
                teethCount: 3,
                toothGapWidth: 2,
                txs: objAngelMouth.txs.rounded16weight3,
            })
                .at(33, 35),
        )
            .mixin(mxnFacingPivot, { left: -3, right: 3, up: -3, down: 3 }),
    )
        .mixin(mxnShadowFloor, { offset: [0, 2] })
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "Mr. Indiana", tintPrimary: 0x698826, tintSecondary: 0xBAB532 })
        .pivoted(41, 72)
        .zIndexed(ZIndex.CharacterEntities);
}
