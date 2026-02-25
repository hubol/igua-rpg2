import { ObjDoor } from "../objects/obj-door";

export function mxnDoorMagic(obj: ObjDoor) {
    return obj.coro(function* () {
        obj.objDoor.style = "Magic";
    });
}
