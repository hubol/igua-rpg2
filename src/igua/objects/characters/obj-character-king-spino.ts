import { Graphics, Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnTinyBoilPivot } from "../../mixins/mxn-boil-tiny-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { mxnSpeakingMouthJaw } from "../../mixins/mxn-speaking-mouth-jaw";
import { objAngelEyes } from "../enemies/obj-angel-eyes";

const [
    txBackLeg,
    txBackArm,
    txSpine,
    txLowerJaw,
    txSkull,
    txDemoEye,
    txLip,
    txSail,
    txFrontLeg,
    txFrontArm,
    txTail0,
    txTail1,
    txCrown,
] = Tx.Characters.KingSpino.Body.split({ width: 118 });

export function objCharacterKingSpino() {
    const headObj = new Graphics().beginFill(0xff0000).drawRect(71, 14, 45, 26).invisible();
    const lowerJawObj = Sprite.from(txLowerJaw);

    return container(
        Sprite.from(txBackLeg),
        Sprite.from(txBackArm).mixin(mxnTinyBoilPivot, "y"),
        Sprite.from(txSpine),
        Sprite.from(txSail),
        Sprite.from(txFrontLeg),
        Sprite.from(txFrontArm).mixin(mxnTinyBoilPivot, "y"),
        Sprite.from(txTail0).mixin(objCharacterKingSpino.mxnFxTail, txTail0, txTail1),
        container(
            lowerJawObj
                .mixin(mxnSpeakingMouthJaw, [-2, 4], 60),
            Sprite.from(txSkull),
            Sprite.from(txLip),
            objAngelEyes({
                defaultEyelidRestingPosition: 0,
                eyelidsTint: 0xA0A0A0,
                gap: 0,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 3,
                },
                pupilsTint: 0x000000,
                pupilsTx: Tx.Characters.KingSpino.Pupil,
                scleraTx: Tx.Characters.KingSpino.Sclera,
                leftOnly: true,
            })
                .at(95, 22),
            Sprite.from(txCrown).mixin(mxnSinePivot),
        )
            .mixin(mxnTinyBoilPivot, "y"),
        headObj,
    )
        .mixin(mxnHasHead, { obj: headObj })
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "King Spino", tintPrimary: 0xA0A0A0, tintSecondary: 0xFFB600 })
        .pivoted(36, 102);
}

objCharacterKingSpino.mxnFxTail = function mxnFxTail (sprite: Sprite, tx0: Texture, tx1: Texture) {
    return sprite
        .coro(function* (self) {
            while (true) {
                const duration = Rng.intc(333, 500);
                for (let i = 0; i < 3; i++) {
                    yield sleep(duration);
                    self.x = Rng.intc(-3, 0);
                    self.y = Rng.intc(0, 1);
                }
                self.texture = self.texture === tx0 ? tx1 : tx0;
            }
        });
};
