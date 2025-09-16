import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";

export function objMusician() {
}

objMusician.objHubolish = function () {
    const [txBody, txFeet0, txFeet1, txFaceDefault, txKeyboard, txHandLeft, txHandRight] = Tx.Esoteric.Musicians
        .Hubolish.split({ width: 50 });
    return function objHubolish () {
        const feetObj = Sprite.from(txFeet0);
        const faceObj = Sprite.from(txFaceDefault).mixin(mxnBoilPivot);
        const leftHandObj = Sprite.from(txHandLeft);
        const rightHandObj = Sprite.from(txHandRight);

        const methods = {
            nextBeat() {
                feetObj.texture = feetObj.texture === txFeet0 ? txFeet1 : txFeet0;
                const choice = Rng.int(4);
                leftHandObj.y = 0;
                rightHandObj.y = 0;

                if (choice === 1) {
                    leftHandObj.y = -4;
                    rightHandObj.y = 0;
                }
                else if (choice === 2) {
                    leftHandObj.y = 0;
                    rightHandObj.y = -4;
                }
            },
        };

        return container(
            Sprite.from(txBody),
            feetObj,
            faceObj,
            Sprite.from(txKeyboard),
            leftHandObj,
            rightHandObj,
        )
            .pivoted(29, 45)
            .merge({ methods });
    };
}();
