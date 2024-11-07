import { DisplayObject } from "pixi.js";
import { scene } from "../globals";

export function ogmoAddToLayer(obj: DisplayObject, layerName: string) {
    if (obj.parent) {
        return;
    }

    if (layerName === "ParallaxDecals") {
        obj.show(scene.parallaxStage);
    }

    if (!obj.parent) {
        obj.show();
    }
}
