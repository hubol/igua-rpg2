import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnTinyBoilPivot } from "../../mixins/mxn-boil-tiny-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { mxnSpeakingMouthJaw } from "../../mixins/mxn-speaking-mouth-jaw";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objCharacterKingSpino } from "./obj-character-king-spino";

const [
    txLimbsFar,
    txCrown,
    txTail0,
    txTail1,
    txTorso,
    txLimbsNear,
    txJaw,
    txNoggin,
    txScleraDemo,
    txPupilDemo,
    txEyebrow,
] = Tx.Characters.PrinceSpino.ProstrateLayers.split({ width: 180 });

const [txSclera, txPupil] = Tx.Characters.PrinceSpino.EyeLayers.split({ count: 2 });

export function objCharacterPrinceSpino() {
    const headObj = new Graphics().beginFill(0xff0000).drawRect(3, 32, 48, 21).invisible();

    return container(
        Sprite.from(txLimbsFar)
            .mixin(mxnTinyBoilPivot, "x"),
        Sprite.from(txCrown)
            .mixin(mxnSinePivot),
        Sprite.from(txTail0).mixin(objCharacterKingSpino.mxnFxTail, txTail0, txTail1),
        Sprite.from(txTorso),
        Sprite.from(txLimbsNear)
            .mixin(mxnTinyBoilPivot, "x"),
        Sprite.from(txJaw)
            .mixin(mxnSpeakingMouthJaw, [-2, 3], 30),
        Sprite.from(txNoggin),
        Sprite.from(txScleraDemo),
        Sprite.from(txPupilDemo),
        objAngelEyes({
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xA0A0A0,
            gap: 0,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 0,
            },
            pupilsTint: 0xffffff,
            pupilsTx: txPupil,
            scleraTx: txSclera,
            leftOnly: true,
        })
            .at(41, 39),
        Sprite.from(txEyebrow).mixin(mxnBoilPivot),
        headObj,
    )
        .mixin(mxnHasHead, { obj: headObj })
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "Prince Spino", tintPrimary: 0xA0A0A0, tintSecondary: 0xFFB600 })
        .pivoted(86, 51)
        .zIndexed(ZIndex.CharacterEntities);
}
