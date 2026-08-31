import { DisplayObject, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { mxnSpeakingMouthJaw } from "../../mixins/mxn-speaking-mouth-jaw";
import { objAngelEyes } from "../enemies/obj-angel-eyes";

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
    return container(
        Sprite.from(txLimbsFar)
            .mixin(mxnFxBoilTiny),
        Sprite.from(txCrown)
            .mixin(mxnSinePivot),
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
        Sprite.from(txTorso),
        Sprite.from(txLimbsNear)
            .mixin(mxnFxBoilTiny),
        Sprite.from(txJaw)
            .mixin(mxnSpeakingMouthJaw, [0, 4], 30),
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
    )
        .mixin(mxnDetectPlayer)
        .pivoted(86, 51)
        .zIndexed(ZIndex.CharacterEntities);
}

function mxnFxBoilTiny(obj: DisplayObject) {
    return obj
        .coro(function* (self) {
            while (true) {
                yield sleep(Rng.int(333, 1000));
                self.pivot.x = Rng.intc(-1, 1);
            }
        });
}
