import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";

export function mxnRpgStatusBodyPart(obj: DisplayObject, model: RpgStatus.BodyPart.Model) {
    return obj
        .merge({ mxnRpgStatusBodyPart: { model } });
}
