import { Graphics } from "pixi.js";
import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";

export function objSafeMarker(entity: OgmoEntities.SafeMarker) {
    return new Graphics()
        .tinted(entity.tint!)
        .beginFill(0xffffff)
        .drawRect(0, 0, 1, 1)
        .invisible()
        .track(objSafeMarker);
}
