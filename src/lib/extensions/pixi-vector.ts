import { DisplayObject, ObservablePoint, Point } from "pixi.js";
import { Vector, defineVectorProperties } from "../math/vector-type";

declare module "pixi.js" {
    interface DisplayObject extends Vector { }
    interface ObservablePoint extends Vector { }
    interface Point extends Vector { }
}

defineVectorProperties(DisplayObject.prototype, { omit: [ 'scale' ] });
defineVectorProperties(ObservablePoint.prototype);
defineVectorProperties(Point.prototype);
