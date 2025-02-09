import { DisplayObject } from "pixi.js";
import { scene } from "../globals";
import { ZIndex } from "../core/scene/z-index";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";

export function ogmoAddToLayer(obj: DisplayObject, layerName: string) {
    if (obj.parent) {
        return;
    }

    if (layerName === "ParallaxDecals") {
        obj.show(scene.parallaxStage);
    }

    if (!obj.parent) {
        const zIndex = ZIndex[layerName];
        if (zIndex === undefined) {
            ErrorReporter.reportMisconfigurationError(
                "ogmoAddToLayer",
                new Error("No ZIndex enumeration for layer name: " + layerName),
            );
        }
        else {
            obj.zIndex = zIndex;
        }
        obj.show();
    }
}
