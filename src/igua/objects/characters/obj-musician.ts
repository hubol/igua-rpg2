import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";

export function objMusician() {
}

objMusician.objHubolish = function () {
    const [
        txBody,
        txFeet0,
        txFeet1,
        txFaceDefault,
        txKeyboard,
        txHandLeft,
        txHandRight,
        txLipSmallO,
        txLipBigO,
        txLipE,
        txLipA,
        txLipS,
        txLipF,
        txLipL,
        txLipP,
    ] = Tx.Esoteric.Musicians
        .Hubolish.split({ width: 50 });

    const faceTxs: Record<string, Texture> = {
        c: txLipSmallO,
        o: txLipSmallO,
        g: txLipSmallO,
        h: txLipSmallO,
        u: txLipSmallO,
        w: txLipSmallO,
        r: txLipSmallO,
        O: txLipBigO,
        e: txLipE,
        y: txLipE,
        i: txLipE,
        uh: txLipE,
        a: txLipA,
        UH: txLipA,
        ch: txLipS,
        sh: txLipS,
        s: txLipS,
        t: txLipS,
        d: txLipL,
        th: txLipS,
        f: txLipF,
        v: txLipF,
        l: txLipL,
        n: txLipL,
        p: txLipP,
        b: txLipP,
        m: txLipP,
    };

    return function objHubolish () {
        const feetObj = Sprite.from(txFeet0);
        const faceObj = Sprite.from(txFaceDefault).mixin(mxnBoilPivot);
        const leftHandObj = Sprite.from(txHandLeft);
        const rightHandObj = Sprite.from(txHandRight);

        function getLipTx(lip: string | null) {
            return faceTxs[lip ?? ""] ?? txFaceDefault;
        }

        const methods = {
            nextBeat() {
                feetObj.texture = feetObj.texture === txFeet0 ? txFeet1 : txFeet0;
                const choice = Rng.int(4);
                if (choice < 3) {
                    leftHandObj.y = 0;
                    rightHandObj.y = 0;
                }

                if (choice === 1) {
                    leftHandObj.y = -4;
                }
                else if (choice === 2) {
                    rightHandObj.y = -4;
                }
            },
            setLip(lip: string | null) {
                faceObj.texture = getLipTx(lip);
            },
            unsetLip(lip: string | null) {
                if (faceObj.texture === getLipTx(lip)) {
                    faceObj.texture = txFaceDefault;
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

objMusician.objLottieish = function () {
    const [txBody, txFeet0, txFeet1, txFaceDefault, txGuitar, txHandLeft, txHandRight] = Tx.Esoteric.Musicians
        .Lottieish.split({ width: 66 });
    return function objLottieish () {
        let strumming = false;

        const feetObj = Sprite.from(txFeet0);
        const faceObj = Sprite.from(txFaceDefault).mixin(mxnBoilPivot);

        const leftHandObj = Sprite.from(txHandLeft).mixin(mxnBoilPivot);
        const rightHandObj = Sprite.from(txHandRight).mixin(mxnBoilPivot);

        for (const handObj of [leftHandObj, rightHandObj]) {
            handObj.step((self) => {
                if (!strumming) {
                    self.pivot.at(0, 0);
                }
            });
        }

        const methods = {
            nextBeat() {
                feetObj.texture = feetObj.texture === txFeet0 ? txFeet1 : txFeet0;
                const choice = Rng.int(4);
                if (choice < 3) {
                    leftHandObj.at(0, 0);
                    rightHandObj.at(0, 0);
                }

                if (choice === 1) {
                    rightHandObj.at(-2, 2);
                }
                else if (choice === 2) {
                    leftHandObj.at(2, -2);
                }
            },
            setStrumming(value: boolean) {
                strumming = value;
            },
        };

        return container(
            Sprite.from(txBody),
            feetObj,
            faceObj,
            Sprite.from(txGuitar),
            leftHandObj,
            rightHandObj,
        )
            .pivoted(23, 55)
            .merge({ methods });
    };
}();
