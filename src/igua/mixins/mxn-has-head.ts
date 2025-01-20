import { DisplayObject } from "pixi.js";

interface MxnHasHeadArgs {
    obj: DisplayObject;
}

// TODO "non-diegetic" position/object?
export function mxnHasHead(obj: DisplayObject, mxnHead: MxnHasHeadArgs) {
    return obj
        .merge({ mxnHead });
}
