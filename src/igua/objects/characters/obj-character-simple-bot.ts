import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [txBody, txNoggin] = Tx.Characters.SimpleBot.Body.split({ count: 2 });
const [txLeg, txArmRest, txArmT] = Tx.Characters.SimpleBot.Limbs.split({ count: 3 });

export function objCharacterSimpleBot() {
    const api = {
        armPoseSeed: 0,
        wigVisible: false,
        mulletVisible: false,
        leftLegVisible: false,
        rightLegVisible: false,
        leftArmVisible: false,
        rightArmVisible: false,
    };

    return container(
        Sprite.from(Tx.Characters.SimpleBot.Mullet)
            .at(8, 30)
            .step(self => self.visible = api.mulletVisible),
        Sprite.from(txBody),
        Sprite.from(txLeg)
            .pivoted(5, 35)
            .at(55, 80)
            .step(self => self.visible = api.rightLegVisible),
        Sprite.from(txLeg)
            .pivoted(5, 35)
            .scaled(-1, 1)
            .at(24, 80)
            .step(self => self.visible = api.leftLegVisible),
        Sprite.from(txArmRest)
            .pivoted(12, 8)
            .step(self => self.texture = ((api.armPoseSeed + 8) % 16) < 8 ? txArmT : txArmRest)
            .at(63, 53)
            .step(self => self.visible = api.rightArmVisible),
        Sprite.from(txArmRest)
            .pivoted(12, 8)
            .scaled(-1, 1)
            .step(self => self.texture = (api.armPoseSeed % 2) === 1 ? txArmT : txArmRest)
            .at(19, 53)
            .step(self => self.visible = api.leftArmVisible),
        container(
            Sprite.from(txNoggin),
            Sprite.from(Tx.Characters.SimpleBot.Wig)
                .at(4, -10)
                .mixin(mxnFacingPivot, { up: -1, left: -1, down: 1, right: 1 })
                .step(self => self.visible = api.wigVisible),
            container(
                objAngelMouth({
                    negativeSpaceTint: 0x715AC4,
                    teethCount: 3,
                    toothGapWidth: 3,
                    txs: objAngelMouth.txs.rounded14,
                })
                    .at(40, 34),
                objAngelEyes({
                    defaultEyelidRestingPosition: 0,
                    eyelidsTint: 0xA399C5,
                    gap: 20,
                    pupilRestStyle: {
                        kind: "cross_eyed",
                        offsetFromCenter: 3,
                    },
                    pupilsTint: 0x715AC4,
                    pupilsTx: Tx.Characters.SimpleBot.Pupil,
                    scleraTx: Tx.Characters.SimpleBot.Sclera,
                })
                    .at(40, 25),
            )
                .mixin(mxnFacingPivot, { up: -3, left: -3, down: 3, right: 3 }),
        ),
    )
        .mixin(mxnSpeaker, { name: "Bot in Disrepair", tintPrimary: 0xA399C5, tintSecondary: 0x00C48D })
        .handles("mxnSpeaker.speakingStarted", () => api.armPoseSeed = Rng.int(0, 999999999))
        .pivoted(42, 78)
        .mixin(mxnDetectPlayer)
        .merge({ objCharacterSimpleBot: api });
}
