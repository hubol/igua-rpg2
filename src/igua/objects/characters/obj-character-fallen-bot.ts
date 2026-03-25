import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interpc } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [txBody, txNoggin, txBulb] = Tx.Characters.FallenBot.Body.split({ count: 3 });

export function objFallenBot() {
    const mouthObj = objAngelMouth({
        txs: objAngelMouth.txs.rounded14,
        negativeSpaceTint: 0x4BDDEA,
        teethCount: 2,
        toothGapWidth: 2,
    });
    return container(
        Sprite.from(txBody),
        container(
            Sprite.from(txNoggin),
            objAngelEyes({
                defaultEyelidRestingPosition: 0,
                eyelidsTint: 0x5E45B7,
                scleraTx: Tx.Characters.FallenBot.Sclera,
                sclerasTint: 0x4BDDEA,
                pupilsTx: Tx.Characters.FallenBot.Pupil,
                pupilsTint: 0xffffff,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 4,
                },
                gap: 15,
            })
                .at(35, 40),
            mouthObj
                .at(35, 51),
            Sprite.from(txBulb)
                .coro(function* (self) {
                    self.tint = Rng.color();
                    while (true) {
                        yield sleep(Rng.int(333, 666));
                        yield interpc(self, "tint").steps(4).to(Rng.color()).over(Rng.int(666, 1250));
                    }
                })
                .mixin(mxnSinePivot),
        )
            .mixin(mxnBoilPivot),
    )
        .merge({ objFallenBot: { mouthObj } })
        .mixin(mxnDetectPlayer)
        .pivoted(38, 85);
}

objFallenBot.objImpactSite = function objImpactSite () {
    return Sprite.from(Tx.Characters.FallenBot.ImpactSite)
        .pivoted(38, 85);
};
