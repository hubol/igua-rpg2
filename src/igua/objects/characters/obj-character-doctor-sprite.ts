import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objAngelEyes } from "../enemies/obj-angel-eyes";
import { objAngelMouth } from "../enemies/obj-angel-mouth";

const [bodyTx, nogginTx, hairTx, doctorHeadThingTx, armTx, heldSodaTx] = Tx.Characters.DoctorSprite.Layers.split({
    width: 88,
});

export function objCharacterDoctorSprite() {
    const armObj = Sprite.from(armTx);
    const heldSodaObj = Sprite.from(heldSodaTx).mixin(mxnSinePivot);

    let armUnit = 0;

    const controls = {
        get armUnit() {
            return armUnit;
        },
        set armUnit(value) {
            armObj.visible = value > 0.75;
            heldSodaObj.visible = value > 0.25;
            heldSodaObj.x = value > 0.75 ? 0 : -20;
            armUnit = value;
        },
    };

    controls.armUnit = 0;

    return container(
        Sprite.from(bodyTx),
        container(
            Sprite.from(nogginTx),
            Sprite.from(hairTx),
            objAngelMouth({
                txs: objAngelMouth.txs.w14b,
                negativeSpaceTint: 0x000000,
                teethCount: 2,
                toothGapWidth: 2,
            })
                .at(24, 37),
            objAngelEyes({
                pupilsTint: 0x000000,
                eyelidsTint: 0x808080,
                gap: 12,
                defaultEyelidRestingPosition: 0,
                pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 1 },
                scleraTx: Tx.Characters.DoctorSprite.Sclera,
                pupilsTx: Tx.Characters.DoctorSprite.Pupil,
            })
                .at(25, 26),
            Sprite.from(doctorHeadThingTx),
        )
            .mixin(mxnSinePivot),
        armObj,
        heldSodaObj,
    )
        .merge({ objCharacterDoctorSprite: { controls } })
        .mixin(mxnDetectPlayer)
        .pivotedUnit(.6, 1);
}
