import { DisplayObject } from "pixi.js";
import { Vector, defineVectorProperties } from "../math/vector-type";

declare module "pixi.js" {
    interface DisplayObject extends Vector { }
}

defineVectorProperties(DisplayObject.prototype);
