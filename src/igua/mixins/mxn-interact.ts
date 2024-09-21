import { DisplayObject } from "pixi.js";
import { playerObj } from "../objects/obj-player";
import { Input } from "../globals";

export function mxnInteract<TObj extends DisplayObject>(obj: TObj, interactFn: () => void) {
    return obj.step(() => {
        if (playerObj.hasControl && Input.justWentDown("Interact") && playerObj.collides(obj)) {
            interactFn();
        }
    });
}
