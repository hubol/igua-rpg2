import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelEyes } from "../enemies/obj-angel-eyes";

const [
    txLegsIdle,
    txLegsJump,
    txBrush0,
    txBrush1,
    txArmsIdle,
    txArmsJump,
    txDemoFace,
] = Tx.Characters.ForestSpirit.Layers.split({ width: 48 });

export function objCharacterForestSpirit() {
    const legsObj = Sprite.from(txLegsIdle);
    const armsObj = Sprite.from(txArmsIdle);

    return container(
        legsObj,
        container(
            Sprite.from(txBrush0),
            Sprite.from(txBrush1),
        )
            .mixin(mxnBoilPivot)
            .coro(function* (self) {
                while (true) {
                    const mode = Rng.int(3);
                    const offset = Rng.int(self.children.length);

                    let alpha = 1;

                    for (let i = 0; i < self.children.length; i++) {
                        const index = (offset + i) % self.children.length;
                        self.children[index].alpha = alpha;

                        if (mode === 0) {
                            alpha = 0;
                        }
                        else if (mode === 1) {
                            alpha = 0.7;
                        }
                        else if (mode === 2) {
                            alpha = 1;
                        }
                    }

                    yield sleep(Rng.int(100, 400));
                }
            }),
        armsObj
            .mixin(mxnFacingPivot, { left: -2, right: 2, up: -2, down: 2 }),
        container(
            Sprite.from(Tx.Characters.ForestSpirit.EyeShadow),
            objAngelEyes({
                defaultEyelidRestingPosition: 0,
                eyelidsTint: 0x2C4421,
                gap: 1,
                pupilRestStyle: {
                    kind: "cross_eyed",
                    offsetFromCenter: 0,
                },
                pupilsTint: 0x2C4421,
                pupilsTx: Tx.Characters.ForestSpirit.Pupil,
                scleraTx: Tx.Characters.ForestSpirit.Sclera,
            })
                .at(22, 12),
        )
            .mixin(mxnFacingPivot, { left: -3, right: 3, up: -2, down: 2 }),
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "Spirit of Forest", tintPrimary: 0x4B683F, tintSecondary: 0x2C4421 })
        .zIndexed(ZIndex.CharacterEntities)
        .pivoted(24, 41);
}
