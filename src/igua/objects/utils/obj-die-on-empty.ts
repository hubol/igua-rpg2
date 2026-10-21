import { DisplayObject } from "pixi.js";
import { container } from "../../../lib/pixi/container";
import { mxnDestroyOnEmpty } from "../../mixins/mxn-destroy-on-empty";

// TODO deprecate
export function objDieOnEmpty(...children: DisplayObject[]) {
    return container(...children)
        .mixin(mxnDestroyOnEmpty);
}
