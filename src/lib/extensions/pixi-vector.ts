import { DisplayObject, ObservablePoint, Point, Rectangle } from "pixi.js";
import { Vector, defineVectorProperties } from "../math/vector-type";

declare module "pixi.js" {
    interface DisplayObject extends Vector {}
    interface ObservablePoint extends Vector {}
    interface Point extends Vector {}
    interface Rectangle extends Vector {}
}

defineVectorProperties(DisplayObject.prototype, { omit: ["scale"] });
defineVectorProperties(ObservablePoint.prototype);
defineVectorProperties(Point.prototype);
defineVectorProperties(Rectangle.prototype);
