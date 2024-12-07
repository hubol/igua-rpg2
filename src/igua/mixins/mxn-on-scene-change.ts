import { DisplayObject } from "pixi.js";
import { scene } from "../globals";
import { StepOrder } from "../objects/step-order";

export function mxnOnSceneChange<T extends DisplayObject>(obj: T, onSceneChange: (self: T) => unknown) {
    return obj.coro(function* () {
        while (true) {
            let currentScene = scene;
            yield () => scene !== currentScene;
            onSceneChange(obj);
        }
    }, StepOrder.Camera);
}
