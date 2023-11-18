import { DisplayObject, ObservablePoint } from "pixi.js";
import { Vector, defineVectorProperties } from "../math/vector-type";

declare module "pixi.js" {
    interface DisplayObject extends Vector { }
    interface ObservablePoint extends Vector { }
}

defineVectorProperties(DisplayObject.prototype, { omit: [ 'scale' ] });
defineVectorProperties(ObservablePoint.prototype);
