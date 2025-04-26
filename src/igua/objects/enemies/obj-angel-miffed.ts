import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { objAngelEyes } from "./obj-angel-eyes";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = {};
const ranks = {};
const variants = {};

export function objAngelMiffed() {
    return container(objAngelBody(), objAngelMiffedHead()).pivoted(22, 41).filtered(
        new MapRgbFilter(0xFF77B0, 0x715EFF),
    );
}

function objAngelMiffedHead() {
    const faceObj = objAngelMiffedFace().pivoted(-20, -15);

    return container(
        Sprite.from(Tx.Enemy.Miffed.Noggin0),
        faceObj,
    ).merge({ objects: { faceObj } });
}

function objAngelMiffedFace() {
    const eyesObj = objAngelEyes({
        defaultEyelidRestingPosition: 0,
        eyelidsTint: 0xc80000,
        gap: 11,
        pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 0 },
        pupilTx: Tx.Enemy.Miffed.Pupil0,
        pupilsMirrored: true,
        scleraTx: Tx.Enemy.Miffed.Sclera0,
        sclerasMirrored: true,
    });

    const mouthObj = objAngelMouth({
        negativeSpaceTint: 0x000000,
        teethCount: 1,
        toothGapWidth: 1,
        txs: objAngelMouth.txs.rounded14,
    })
        .at(0, 6);

    return container(eyesObj, mouthObj).merge({ objects: { eyesObj, mouthObj } });
}

function objAngelBody() {
    const leftLegObj = Sprite.from(Tx.Enemy.Miffed.Leg).at(-2, -1);
    const rightLegObj = Sprite.from(Tx.Enemy.Miffed.Leg).at(15, -1);
    const legsMaskObj = new Graphics().beginFill(0x000000).drawRect(-16, 8, 58, 12);
    const legsObj = container(leftLegObj, rightLegObj).masked(legsMaskObj);

    return container(legsObj, Sprite.from(Tx.Enemy.Miffed.Torso0).at(-3, 3), legsMaskObj)
        .at(10, 24);
}
