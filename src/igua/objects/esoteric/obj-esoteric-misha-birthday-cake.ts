import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { blendColor } from "../../../lib/color/blend-color";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { nlerp } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { ZIndex } from "../../core/scene/z-index";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [
    txLayer0,
    txCream0,
    txLayer1,
    txCream1,
    txIcingBack,
    txIcingFront,
] = Tx.Esoteric.MishaBirthday.Cake.split({ count: 6 });

const txsCandleLights = Tx.Esoteric.MishaBirthdayCandleLight.split({ width: 4 });
const txsCandleSmoke = Tx.Esoteric.MishaCandleSmoke.split({ width: 22 });

const prng = new PseudoRng();

export function objEsotericMishaBirthdayCake(candlesCount: Integer) {
    const api = {
        visibleUnit: 0,
        litUnit: 0,
    };

    prng.seed = 999999999993;

    function getVisiblePhase(index: Integer) {
        return Math.max(0, Math.min(1, (api.visibleUnit * 7) - index));
    }

    const maskObj0 = objMask();
    const maskObj1 = objMask();
    const maskObj2 = objMask();
    const maskObj3 = objMask();

    const layerObj0 = Sprite.from(txLayer0);
    const creamObj0 = Sprite.from(txCream0).masked(maskObj0);
    const layerObj1 = Sprite.from(txLayer1);
    const creamObj1 = Sprite.from(txCream1).masked(maskObj1);
    const icingBackObj = Sprite.from(txIcingBack).masked(maskObj2);
    const icingFrontObj = Sprite.from(txIcingFront).masked(maskObj3);

    const candleObjs = Rng.shuffle(
        range(candlesCount)
            .map(() => {
                const yUnit = prng.float();
                const y = Math.round(nlerp(7, 17, yUnit));

                const api = {
                    isLit: false,
                };

                return container(
                    Sprite.from(Tx.Esoteric.MishaBirthday.Candle)
                        .anchored(0.5, 1)
                        .tinted(blendColor(0xffffff, 0x99afdd, 1 - yUnit))
                        .zIndexed(y),
                    objIndexedSprite(txsCandleLights)
                        .anchored(0.5, 1)
                        .at(0, prng.intc(-12, -14))
                        .invisible()
                        .step(self => self.visible = api.isLit)
                        .coro(function* (self) {
                            while (true) {
                                self.textureIndex = Rng.int(3);
                                self.pivot.at(Rng.intc(-1, 1), Rng.intc(-1, 1));
                                yield sleepf(Rng.intc(5, 10));
                            }
                        })
                        .coro(function* (self) {
                            yield () => api.isLit;
                            yield () => !api.isLit;
                            objFxSmoke()
                                .at(self.getWorldPosition())
                                .zIndexed(ZIndex.TerrainDecals)
                                .show();
                        }),
                )
                    .merge({ objCandle: api })
                    .at(prng.intc(5, 81), y);
            }),
    );

    const candlesObj = container(
        ...candleObjs,
    )
        .autoSorted();

    return container(
        layerObj0,
        creamObj0,
        layerObj1,
        creamObj1,
        icingBackObj,
        candlesObj,
        icingFrontObj,
        maskObj0,
        maskObj1,
        maskObj2,
        maskObj3,
    )
        .step(self => {
            self.visible = true;
            layerObj0.y = (1 - getVisiblePhase(0)) * -280;
            maskObj0.pivot.y = (1 - getVisiblePhase(1)) * 1;
            layerObj1.y = (1 - getVisiblePhase(2)) * -280;
            maskObj1.pivot.y = (1 - getVisiblePhase(3)) * 1;
            maskObj2.pivot.x = (1 - getVisiblePhase(4)) * 1;
            maskObj3.pivot.x = (1 - getVisiblePhase(5)) * -1;
            const candlesVisible = getVisiblePhase(6) * candleObjs.length;
            const candlesLit = candleObjs.length * api.litUnit;
            for (let i = 0; i < candleObjs.length; i++) {
                const candleObj = candleObjs[i];
                candleObj.visible = candlesVisible > i;
                candleObj.objCandle.isLit = candleObj.visible && candlesLit > i;
            }
        })
        .merge({ objEsotericMishaBirthdayCake: api })
        .invisible()
        .pivoted(43, 28);
}

function objMask() {
    return new Graphics().beginFill(0xff0000).drawRect(0, 0, 1, 1).scaled(86, 34);
}

function objFxSmoke() {
    return objEphemeralSprite(txsCandleSmoke, Rng.float(13, 16) / 60)
        .tinted(blendColor(0x505050, 0xa0a0a0, Rng.float()))
        .pivoted(1, 30);
}
