import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { mxnSpeakingMouth } from "../../mixins/mxn-speaking-mouth";
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
    let agapeUnit = 0;

    return container(
        Sprite.from(txBackLeg),
        Sprite.from(txBackArm).mixin(mxnTinyBoilPivot),
        Sprite.from(txSpine),
        Sprite.from(txSail),
        Sprite.from(txFrontLeg),
        Sprite.from(txFrontArm).mixin(mxnTinyBoilPivot),
        Sprite.from(txTail0)
            .coro(function* (self) {
                while (true) {
                    const duration = Rng.intc(333, 500);
                    for (let i = 0; i < 3; i++) {
                        yield sleep(duration);
                        self.x = Rng.intc(-3, 0);
                        self.y = Rng.intc(0, 1);
                    }
                    self.texture = self.texture === txTail0 ? txTail1 : txTail0;
                }
            }),
        container(
            lowerJawObj.mixin(
                mxnSpeakingMouth,
                {
                    get agapeUnit() {
                        return agapeUnit;
                    },
                    set agapeUnit(value) {
                        agapeUnit = value;
                        lowerJawObj.y = Math.round(value * 4);
                        lowerJawObj.x = Math.round(value * -2);
                    },
                    baseAnimationDuration: 60,
                },
            ),
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
            .mixin(mxnTinyBoilPivot),
        headObj,
    )
        .mixin(mxnHasHead, { obj: headObj })
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "King Spino", tintPrimary: 0xA0A0A0, tintSecondary: 0xFFB600 })
        .pivoted(36, 102);
}

function mxnTinyBoilPivot(obj: DisplayObject) {
    return obj
        .coro(function* () {
            while (true) {
                yield sleep(Rng.intc(333, 500));
                let dir = Rng.intp();
                obj.pivot.y = Math.max(-1, Math.min(1, obj.pivot.y + dir));
            }
        });
}
