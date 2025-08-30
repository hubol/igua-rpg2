import { DisplayObject } from "pixi.js";
import { playerObj } from "../objects/obj-player";

export function mxnCollectibleLoot(obj: DisplayObject) {
    const mxnCollectibleLoot = {
        get collectConditionsMet() {
            return playerObj.hasControl && obj.collides(playerObj);
        },
    };

    return obj.merge({ mxnCollectibleLoot });
}
