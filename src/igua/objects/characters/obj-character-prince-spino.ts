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

const [txSclera, txPupil] = Tx.Characters.PrinceSpino.EyeLayers.split({ count: 2 });

export function objCharacterPrinceSpino() {
    const api = {
        isUpright: false,
    };

    const headObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(3, 32, 48, 21)
        .step(self => {
            if (api.isUpright) {
                self.at(3, -47);
            }
            else {
                self.at(0, 0);
            }
        })
        .invisible();

    return container(
        objCharacterPrinceSpinoProstrate().step(self => self.visible = !api.isUpright),
        objCharacterPrinceSpinoUpright()
            .at(7, -28)
            .step(self => self.visible = api.isUpright),
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
            .at(41, 39)
            .step(self => {
                if (api.isUpright) {
                    self.at(45, -8);
                }
                else {
                    self.at(41, 39);
                }
            }),
        headObj,
    )
        .merge({ objCharacterPrinceSpino: api })
        .mixin(mxnHasHead, { obj: headObj })
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "Prince Spino", tintPrimary: 0xA0A0A0, tintSecondary: 0xFFB600 })
        .pivoted(86, 51)
        .zIndexed(ZIndex.CharacterEntities);
}

function objCharacterPrinceSpinoProstrate() {
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
        Sprite.from(txEyebrow).mixin(mxnBoilPivot),
    );
}

function objCharacterPrinceSpinoUpright() {
    const [
        txLegFar,
        txArmFar,
        txTail0,
        txTail1,
        txTorso,
        txLegNear,
        txArmNear,
        txJaw,
        txNoggin,
        txEyeDemo,
        txCrown,
    ] = Tx.Characters.PrinceSpino.UprightLayers.split({ width: 176 });

    return container(
        Sprite.from(txLegFar),
        Sprite.from(txArmFar).mixin(mxnTinyBoilPivot, "y"),
        Sprite.from(txCrown)
            .mixin(mxnSinePivot),
        Sprite.from(txTail0).mixin(objCharacterKingSpino.mxnFxTail, txTail0, txTail1),
        Sprite.from(txTorso),
        Sprite.from(txLegNear),
        Sprite.from(txArmNear).mixin(mxnTinyBoilPivot, "y"),
        Sprite.from(txJaw)
            .mixin(mxnSpeakingMouthJaw, [1, 3], 30),
        Sprite.from(txNoggin),
    );
}
