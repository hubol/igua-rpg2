import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { mxnBoilFlipH } from "../../mixins/mxn-boil-flip-h";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnShadowFloor } from "../../mixins/mxn-shadow-floor";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

export function objCharacterNutcase() {
    return container(
        Sprite.from(Tx.Characters.Nutcase.Body)
            .mixin(mxnBoilFlipH),
        container(
            objAngelEyes({
                eyelidsTint: 0xC199FF,
                defaultEyelidRestingPosition: 0,
                gap: 4,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 2,
                },
                pupilsTint: 0x8438FF,
                pupilsTx: Tx.Characters.Nutcase.Pupil,
                scleraTx: Tx.Characters.Nutcase.Sclera,
            }),
            objAngelMouth({
                negativeSpaceTint: 0x8438FF,
                teethCount: 2,
                toothGapWidth: 3,
                txs: objAngelMouth.txs.rounded16weight3,
            })
                .at(0, 13),
            Sprite.from(Tx.Characters.Nutcase.Eyebrows)
                .at(-33, -26)
                .mixin(mxnBoilFlipH),
        )
            .at(33, 23),
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnShadowFloor, { offset: vnew() })
        .pivoted(34, 59);
}
