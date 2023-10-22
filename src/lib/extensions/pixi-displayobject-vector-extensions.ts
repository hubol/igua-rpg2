import { DisplayObject } from "pixi.js";
import { Vector, extendPrototypeAsVector } from "../math/vector-type";

declare module "pixi.js" {
    interface DisplayObject extends Vector { }
}

extendPrototypeAsVector(DisplayObject.prototype);
