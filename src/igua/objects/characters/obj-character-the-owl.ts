import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { mxnSpeakingMouthJaw } from "../../mixins/mxn-speaking-mouth-jaw";
import { objAngelEyes } from "../enemies/obj-angel-eyes";

const [
    txWingsDown,
    txWingsUp,
    txFeet,
    txBody,
    txFeathers,
    txFace,
    txEyeDemo,
    txHorns,
    txBeakLower,
    txBeakUpper,
] = Tx.Characters.TheOwl.Layers.split({ width: 84 });

export function objCharacterTheOwl() {
    const api = {
        wingsRaised: false,
    };

    const bodyObj = Sprite.from(txBody).at(20, 7).trimmed();

    return container(
        Sprite.from(txWingsDown)
            .step(self => self.texture = api.wingsRaised ? txWingsUp : txWingsDown)
            .mixin(mxnFacingPivot, { left: 2, right: -2, up: 0, down: 0 }),
        Sprite.from(txFeet),
        bodyObj,
        Sprite.from(txFeathers).mixin(mxnBoilPivot),
        container(
            Sprite.from(txFace),
            Sprite.from(txHorns),
            objAngelEyes({
                defaultEyelidRestingPosition: 3,
                gap: 6,
                eyelidsTint: 0xFF60A2,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 0,
                },
                pupilsTint: 0xFF237F,
                pupilsTx: Tx.Characters.TheOwl.Pupil,
                scleraTx: Tx.Characters.TheOwl.Sclera,
                pupilsMirrored: true,
                sclerasMirrored: true,
                sclerasTint: 0xFFDD32,
            })
                .at(42, 18),
            Sprite.from(txBeakLower)
                .mixin(mxnSpeakingMouthJaw, [0, 3], 60),
            Sprite.from(txBeakUpper),
        )
            .mixin(mxnFacingPivot, { down: 3, up: -1, left: -4, right: 4 }),
    )
        .collisionShape(CollisionShape.DisplayObjects, [bodyObj])
        .pivoted(42, 50)
        .mixin(mxnSpeaker, { name: "The Owl", tintPrimary: 0xffffff, tintSecondary: 0xFF237F })
        .mixin(mxnDetectPlayer)
        .zIndexed(ZIndex.CharacterEntities);
}
