import { DisplayObject } from "pixi.js";

declare global {
    function onDisplayObjectConstructed(obj: DisplayObject): void;
}
