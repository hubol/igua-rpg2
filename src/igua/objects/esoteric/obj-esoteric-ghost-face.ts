import { Sprite } from "pixi.js";
import { Mzk } from "../../../assets/music";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnBpm } from "../../mixins/mxn-bpm";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const tints = [0x7A7E62, 0x646D59, 0x414F30];
const prng = new PseudoRng();

export function objEsotericGhostFace() {
    const faceObj = Sprite.from(Tx.Esoteric.GhostTownInteriorFace)
        .pivoted(15, 12)
        .scaled(Rng.intp(), 1)
        .at(15, 12);
    const mouthObj = objAngelMouth({
        negativeSpaceTint: 0x000000,
        txs: objAngelMouth.txs.rounded14,
        teethCount: 2,
        toothGapWidth: 2,
    });
    return container(
        faceObj,
        mouthObj
            .at(16, 19),
    )
        .coro(function* (self) {
            prng.seed = self.x + self.y;
            prng.bool();
            faceObj.tint = prng.item(tints);
        })
        // TODO i think bpm should be attached to music
        // Also wouldn't it be cool if the face could be agnostic of this music?
        .mixin(mxnBpm, { mzk: Mzk.OldWays, bpm: 120 })
        .coro(function* (self) {
            mouthObj.controls.frowning = true;
            mouthObj.controls.agapeUnit = Rng.int(2);
            while (true) {
                yield self.mxnBpm.onMeasureChange;
                yield self.mxnBpm.onMeasureChange;
                yield self.mxnBpm.onMeasureChange;
                yield self.mxnBpm.onMeasureChange;
                if (Rng.bool()) {
                    faceObj.scale.x = Rng.intp();
                }
                if (mouthObj.controls.agapeUnit === 0) {
                    mouthObj.controls.teethExposedUnit = Rng.float() > 0.8 ? 1 : 0;
                }
                yield interp(mouthObj.controls, "agapeUnit")
                    .to(mouthObj.controls.agapeUnit === 0 ? 1 : 0)
                    .over(250);
            }
        })
        .pivoted(14, 12);
}
