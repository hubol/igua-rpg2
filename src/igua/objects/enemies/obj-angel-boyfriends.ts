import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { nlerp } from "../../../lib/math/number";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ZIndex } from "../../core/scene/z-index";
import { mxnFxVibrate } from "../../mixins/effects/mxn-fx-vibrate";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { objAngelMouth } from "./obj-angel-mouth";

interface ObjAngelBoyfriendsArgs {
    tints: {
        angry: RgbInt;
        sad: RgbInt;
        antlers: RgbInt;
    };
}

const [txIdle, txMove, txKissStart, txKiss, txPride, txFace] = Tx.Enemy.Boyfriends.Bodies.split({ width: 112 });

const bodyTexturesSupportingFace = new Set([txIdle, txMove, txPride]);

export function objAngelBoyfriends(args: ObjAngelBoyfriendsArgs) {
    const puppetObj = objAngelBoyfriendsPuppet()
        .filtered(new MapRgbFilter(args.tints.angry, args.tints.sad, args.tints.antlers));

    return container(
        puppetObj,
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 0.3, physicsRadius: 30, physicsOffset: [0, -30] })
        .pivoted(56, 70)
        .zIndexed(ZIndex.Entities)
        .coro(function* (self) {
            while (true) {
                if (!self.mxnDetectPlayer.isDetected && puppetObj.objAngelBoyfriendsPuppet.pitchfork.appearUnit > 0) {
                    yield interp(puppetObj.objAngelBoyfriendsPuppet.pitchfork, "appearUnit").to(0).over(333);
                }
                yield () => self.mxnDetectPlayer.isDetected;
                const direction = Math.sign(self.mxnDetectPlayer.relativePosition.x);
                puppetObj.objAngelBoyfriendsPuppet.pitchfork.facingPolar = direction;
                if (puppetObj.objAngelBoyfriendsPuppet.pitchfork.appearUnit < 1) {
                    yield interp(puppetObj.objAngelBoyfriendsPuppet.pitchfork, "appearUnit").to(1).over(1000);
                }
                yield interp(self.speed, "x").to(direction * 3).over(1000);
                yield () => self.speed.x === 0;
                if (
                    !self.mxnDetectPlayer.isDetected || Math.sign(self.mxnDetectPlayer.relativePosition.x) === direction
                ) {
                    self.speed.at(0, -7);
                    yield interp(self.speed, "x").to(direction * 3).over(1000);
                    self.speed.x = 0;
                }
            }
        })
        .step(self => {
            puppetObj.objAngelBoyfriendsPuppet.movementSpeed.at(self.speed);
        });
}

function objAngelBoyfriendsPuppet() {
    const mouthObjs = {
        angry: objAngelMouth({
            negativeSpaceTint: 0x000000,
            teethCount: 2,
            toothGapWidth: 2,
            txs: objAngelMouth.txs.rounded16weight3,
        })
            .at(34, 39),
        sad: objAngelMouth({
            negativeSpaceTint: 0x000000,
            teethCount: 4,
            toothGapWidth: 1,
            txs: objAngelMouth.txs.rounded16weight3,
        })
            .at(80, 38),
    };

    const api = {
        movementSpeed: vnew(),
        kissUnit: 0,
        isExpressingPride: false,
        mouthObjs,
        pitchfork: {
            appearUnit: 0,
            facingPolar: 1,
        },
    };

    let pedometer = 0;

    const bodiesSprite = Sprite.from(txIdle);
    const faceObj = container(
        Sprite.from(txFace),
        mouthObjs.angry,
        mouthObjs.sad,
    )
        .mixin(mxnFacingPivot, { down: 3, left: -3, right: 3, up: -3 });

    const pitchforkObj = Sprite.from(Tx.Enemy.Boyfriends.Pitchfork)
        .invisible()
        .anchored(0.5, 0.5)
        .at(78, 55)
        .step(self => {
            self.alpha = api.pitchfork.appearUnit < 1 ? 0.5 : 1;
            self.visible = api.pitchfork.appearUnit > 0;
            self.pivot.y = nlerp(32, 0, api.pitchfork.appearUnit) + (bodiesSprite.texture === txMove ? 1 : 0);
            self.scale.x = Math.sign(api.pitchfork.facingPolar);
            self.x = api.pitchfork.facingPolar > 0 ? 78 : 34;
        });

    return container(
        bodiesSprite,
        faceObj,
        pitchforkObj,
    )
        .merge({ objAngelBoyfriendsPuppet: api })
        .mixin(mxnFxVibrate)
        .step(() => {
            if (api.movementSpeed.x === 0 || api.movementSpeed.y !== 0) {
                pedometer = 0;
            }
            else {
                pedometer += Math.abs(api.movementSpeed.x);
            }
        })
        .step(() => {
            if (api.isExpressingPride) {
                bodiesSprite.texture = txPride;
            }
            else if (api.kissUnit > 0.9) {
                bodiesSprite.texture = txKiss;
            }
            else if (api.kissUnit > 0) {
                bodiesSprite.texture = txKissStart;
            }
            else if (api.movementSpeed.y !== 0) {
                bodiesSprite.texture = txMove;
            }
            else if (pedometer % 30 > 1 && pedometer % 30 < 16) {
                bodiesSprite.texture = txMove;
            }
            else {
                bodiesSprite.texture = txIdle;
            }

            faceObj.visible = bodyTexturesSupportingFace.has(bodiesSprite.texture);
        });
}
