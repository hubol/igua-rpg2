import { AlphaFilter, BitmapFont, DisplayObject, Sprite } from "pixi.js";
import { approachLinear } from "../../../lib/math/number";

export function mxnFxAlphaVisibility(obj: DisplayObject, visible = true) {
    const useAlphaDirectly = obj instanceof Sprite
        || obj instanceof BitmapFont;

    const alphaTarget = useAlphaDirectly ? obj : createAlphaFilter(obj);

    const mxnFxAlphaVisibility = {
        visible,
    };

    alphaTarget.alpha = visible ? 1 : 0;

    return obj
        .merge({ mxnFxAlphaVisibility })
        .step(() => alphaTarget.alpha = approachLinear(alphaTarget.alpha, mxnFxAlphaVisibility.visible ? 1 : 0, 0.05));
}

function createAlphaFilter(obj: DisplayObject) {
    obj.filters ??= [];
    const alphaFilter = new AlphaFilter();
    obj.filters.push(alphaFilter);
    return alphaFilter;
}
