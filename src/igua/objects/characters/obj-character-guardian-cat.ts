import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [
    txTail,
    txBody,
    txLegsRear,
    txLegsFront,
    txNoggin,
    txEars,
    _,
    txWhiskers,
    txEye,
    txEyebrow,
    txLegsFrontRaised,
] = Tx.Characters.GuardianCat.Layers.split({ width: 88 });

export function objCharacterGuardianCat(rgbMap: MapRgbFilter.Map) {
    const api = {
        frontLegsRaised: false,
    };

    return container(
        Sprite.from(txTail).mixin(mxnBoilPivot),
        Sprite.from(txBody),
        Sprite.from(txLegsRear),
        Sprite.from(txLegsFront).step(self => self.texture = api.frontLegsRaised ? txLegsFrontRaised : txLegsFront),
        container(
            Sprite.from(txNoggin),
            Sprite.from(txEars),
            Sprite.from(txWhiskers)
                .mixin(mxnFacingPivot, { left: -4, right: 4, down: 3, up: -3 }),
            container(
                container(
                    Sprite.from(txEye),
                    Sprite.from(txEyebrow),
                )
                    .mixin(mxnFacingPivot, { left: -2, right: 2, down: 1, up: -1 }),
                objAngelMouth({
                    txs: objAngelMouth.txs.w20,
                    toothGapWidth: 2,
                    teethCount: 2,
                    negativeSpaceTint: 0x00ff00,
                })
                    .at(43, 36),
            )
                .mixin(mxnFacingPivot, { left: -5, right: 5, down: 1, up: -1 }),
        )
            .mixin(mxnFacingPivot, { left: -3, right: 3, down: 0, up: 0 }),
    )
        .mixin(mxnSpeaker, {
            name: "Guardian Cat",
            tintPrimary: rgbMap[1] ?? 0x000000,
            tintSecondary: rgbMap[0] ?? 0xffffff,
        })
        .mixin(mxnDetectPlayer)
        .filtered(new MapRgbFilter(...rgbMap))
        .pivoted(43, 64)
        .merge({ objChararcterGuardianCat: api })
        .zIndexed(ZIndex.CharacterEntities);
}
