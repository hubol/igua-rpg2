import { DisplayObject, Rectangle } from "pixi.js";
import { areRectanglesOverlapping } from "../../math/rectangle";
import { EngineConfig } from "../engine-config";

const rectangle = new Rectangle();
const rendererRectangle = { x: 0, y: 0, width: 0, height: 0 };

export function isOnScreen(obj: DisplayObject) {
    obj.getBounds(false, rectangle);
    rendererRectangle.width = EngineConfig.renderer.width;
    rendererRectangle.height = EngineConfig.renderer.height;
    return areRectanglesOverlapping(rectangle, rendererRectangle);
}
