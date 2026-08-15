import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [
    txTail,
    txTorso,
    txHandSub,
    txHandDom,
    txHandDomThrow,
    txThrowFx,
    txNoggin,
    txEyesDemo,
    txNose,
    txMouthDemo,
    txHat,
] = Tx.Characters.Boxer.Layers.split({ width: 102 });

export function objCharacterBoxer() {
    const handDomObj = Sprite.from(txHandDom)
        .mixin(mxnSinePivot);

    const handDomThrowObj = Sprite.from(txHandDomThrow).invisible();

    const fxObj = container().mixin(mxnBoilPivot);

    let thinking = 0;

    const api = {
        *dramaThrow() {
            // TODO SFX
            handDomObj.visible = false;
            handDomThrowObj.visible = true;

            Sprite.from(txThrowFx)
                .mixin(mxnDestroyAfterSteps, 15)
                .show(fxObj);

            yield sleep(500);

            handDomObj.visible = true;
            handDomThrowObj.visible = false;
        },
        get thinking() {
            return thinking;
        },
        set thinking(value) {
            if (thinking === value) {
                return;
            }
            if (value <= 0) {
                eyesObj.stepsUntilBlink = 60;
            }
            else {
                eyesObj.stepsUntilBlink = -1;
                eyesObj.eyelidMotion = 0;
            }

            eyesObj.closed = value;

            thinking = value;
        },
    };

    const eyesObj = objAngelEyes({
        defaultEyelidRestingPosition: 0,
        eyelidsTint: 0xFF4F87,
        gap: 0,
        pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 0 },
        pupilsTint: 0x000000,
        pupilsTx: Tx.Characters.Boxer.Pupil,
        scleraTx: Tx.Characters.Boxer.Sclera,
        pupilsMirrored: true,
        sclerasMirrored: true,
    });

    return container(
        Sprite.from(txTail)
            .mixin(mxnBoilPivot),
        Sprite.from(txTorso),
        Sprite.from(txHandSub)
            .mixin(mxnSinePivot),
        handDomObj,
        handDomThrowObj,
        container(
            Sprite.from(txNoggin),
            container(
                eyesObj
                    .at(46, 36),
                Sprite.from(txNose),
                objAngelMouth({
                    txs: objAngelMouth.txs.perturbed20,
                    negativeSpaceTint: 0x000000,
                    teethCount: 3,
                    toothGapWidth: 1,
                })
                    .at(46, 46),
            )
                .mixin(mxnFacingPivot, { left: -3, right: 3, down: 0, up: 0 }),
            Sprite.from(txHat),
        )
            .mixin(mxnFacingPivot, { left: -2, right: 2, down: 0, up: 0 }),
        fxObj,
    )
        .pivoted(67, 74)
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "Chester Chimp", tintPrimary: 0xFF6BA1, tintSecondary: 0xFFE500 })
        .zIndexed(ZIndex.CharacterEntities)
        .merge({ objCharacterBoxer: api });
}
