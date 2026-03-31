import { playerObj } from "../objects/obj-player";
import { MxnInteract } from "./mxn-interact";

export function mxnInteractOnlyWhenPlayerIsOnGround(obj: MxnInteract) {
    return obj.step(() => obj.interact.enabled = playerObj.isOnGround);
}
