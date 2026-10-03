import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { blendColor } from "../../../lib/color/blend-color";
import { nlerp } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";

const [
    txLayer0,
    txCream0,
    txLayer1,
    txCream1,
    txIcingBack,
    txIcingFront,
] = Tx.Esoteric.MishaBirthday.Cake.split({ count: 6 });

const prng = new PseudoRng();

export function objEsotericMishaBirthdayCake(candlesCount: Integer) {
    const api = {
        visibleUnit: 0,
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

    const candlesObj = container(
        ...range(candlesCount)
            .map(() => {
                const yUnit = prng.float();
                const y = Math.round(nlerp(7, 17, yUnit));
                return Sprite.from(Tx.Esoteric.MishaBirthday.Candle)
                    .anchored(0.5, 1)
                    .tinted(blendColor(0xffffff, 0x99afdd, 1 - yUnit))
                    .at(prng.intc(5, 81), y)
                    .zIndexed(y);
            }),
    )
        .autoSorted();

    const candleObjs = Rng.shuffle([...candlesObj.children]);

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
            for (let i = 0; i < candleObjs.length; i++) {
                candleObjs[i].visible = candlesVisible > i;
            }
        })
        .merge({ objEsotericMishaBirthdayCake: api })
        .invisible()
        .pivoted(43, 28);
}

function objMask() {
    return new Graphics().beginFill(0xff0000).drawRect(0, 0, 1, 1).scaled(86, 34);
}
