import { Graphics } from "pixi.js";

export function objEnvironmentProjectileOkRegion() {
    return new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, 1, 1)
        .invisible()
        .track(objEnvironmentProjectileOkRegion);
}
