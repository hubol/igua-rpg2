import { DisplayObject } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";

const instanceCounts: Record<symbol, Integer> = {};

function getCount(symbol: symbol) {
    return instanceCounts[symbol] ?? 0;
}

/**
 * `DisplayObject.track()` is a sophisticated mechanism for tracking instances of objects in a single "scene".
 * Some objects have a life across multiple scenes i.e. cutscene objects.
 * This mixin provides a simple mechanism for getting a count of such objects.
 */
export function mxnTrackCountAcrossScenes(obj: DisplayObject, symbol: symbol) {
    if (obj.destroyed) {
        return;
    }

    instanceCounts[symbol] = getCount(symbol) + 1;

    return obj
        .on("removed", () => instanceCounts[symbol]--);
}

mxnTrackCountAcrossScenes.create = function create (symbol: symbol) {
    const mixin = function mxnTrackCountAcrossScenesForSymbol (obj: DisplayObject) {
        return obj.mixin(mxnTrackCountAcrossScenes, symbol);
    };

    mixin.exists = function exists () {
        return getCount(symbol) > 0;
    };

    return mixin;
};
