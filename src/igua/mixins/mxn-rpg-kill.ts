import { DisplayObject } from "pixi.js";
import { RpgAttack } from "../rpg/rpg-attack";
import { mxnRpgAttack } from "./mxn-rpg-attack";

const atkKill = RpgAttack.create({
    physical: 9999,
    emotional: 9999,
});

export function mxnRpgKill(obj: DisplayObject) {
    return obj.mixin(mxnRpgAttack, { attack: atkKill });
}
