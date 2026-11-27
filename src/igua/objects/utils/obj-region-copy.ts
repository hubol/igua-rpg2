import { DisplayObject, Graphics } from "pixi.js";
import { IRectangle } from "../../../lib/math/rectangle";

export function objRegionCopy(obj: DisplayObject | IRectangle) {
    const bounds = obj instanceof DisplayObject ? obj.getWorldBounds() : obj;

    return new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, bounds.width, bounds.height)
        .invisible()
        .at(bounds);
}
