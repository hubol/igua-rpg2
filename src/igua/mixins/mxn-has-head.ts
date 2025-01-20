import { DisplayObject } from "pixi.js";

interface MxnHasHeadArgs {
    obj: DisplayObject;
}

export function mxnHasHead(obj: DisplayObject, mxnHead: MxnHasHeadArgs) {
    return obj
        .merge({ mxnHead });
}
