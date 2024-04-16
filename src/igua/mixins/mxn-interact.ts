import { DisplayObject } from "pixi.js";
import { playerObj } from "../objects/obj-player";
import { Cutscene, Input } from "../globals";

export function mxnInteract<TObj extends DisplayObject>(obj: TObj, interactFn: () => void) {
    return obj.step(() => {
        if (playerObj.collides(obj) && Input.justWentDown('Interact') && !Cutscene.isPlaying)
            interactFn();
    })
}