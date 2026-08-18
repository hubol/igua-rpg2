import { Graphics } from "pixi.js";

export function objRegion() {
    return new Graphics()
        .beginFill(0x00ff00)
        .drawRect(0, 0, 1, 1)
        .track(objRegion)
        .invisible();
}
