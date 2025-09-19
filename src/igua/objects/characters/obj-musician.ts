import { DisplayObject, Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interpr, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { vequals } from "../../../lib/math/vector";
import { vnew } from "../../../lib/math/vector-type";
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

        const offKeysPivot = [0, 6];

        const leftHandObj = Sprite.from(txHandLeft).invisible().pivoted(offKeysPivot).mixin(mxnHandMotion);
        const rightHandObj = Sprite.from(txHandRight).invisible().pivoted(offKeysPivot).mixin(mxnHandMotion);

        function getLipTx(lip: string | null) {
            return faceTxs[lip ?? ""] ?? txFaceDefault;
        }

        const methods = {
            nextBeat() {
                feetObj.texture = feetObj.texture === txFeet0 ? txFeet1 : txFeet0;
            },
            playLowKey() {
                if (state.handsPosition === "off_keys") {
                    return;
                }

                const previousRightHandX = rightHandObj.targetPosition.x;
                rightHandObj.targetPosition.x = Rng.intc(-3, 3);
                if (rightHandObj.targetPosition.x === previousRightHandX) {
                    rightHandObj.targetPosition.x += 1;
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

        const state = {
            handsPosition: "off_keys" as "on_keys" | "off_keys",
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
            .merge({ methods, state })
            .coro(function* () {
                while (true) {
                    yield () => state.handsPosition === "on_keys";

                    leftHandObj.visible = true;
                    rightHandObj.visible = true;

                    yield* Coro.all([
                        interpvr(leftHandObj.pivot).to(0, 0).over(300),
                        interpvr(rightHandObj.pivot).to(0, 0).over(400),
                    ]);

                    yield () => state.handsPosition === "off_keys";

                    yield* Coro.all([
                        interpvr(leftHandObj.pivot).to(offKeysPivot).over(300),
                        interpvr(rightHandObj.pivot).to(offKeysPivot).over(400),
                    ]);
                    leftHandObj.visible = false;
                    rightHandObj.visible = false;
                }
            });
    };
}();

function mxnHandMotion(obj: DisplayObject) {
    return obj
        .merge({ targetPosition: vnew() })
        .coro(function* (self) {
            while (true) {
                yield () => !vequals(self, self.targetPosition);
                self.y -= 1;
                yield sleepf(2);
                self.y -= 1;
                yield sleepf(2);
                yield interpvr(self).to(self.targetPosition).over(80);
            }
        });
}

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
