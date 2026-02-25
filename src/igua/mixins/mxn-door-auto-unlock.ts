import { ObjDoor } from "../objects/obj-door";

export function mxnDoorAutoUnlock(obj: ObjDoor, isLockedProvider: () => boolean) {
    return obj
        .coro(function* () {
            obj.objDoor.locked = isLockedProvider();
        })
        .step(() => {
            const locked = isLockedProvider();
            if (locked !== obj.objDoor.locked) {
                if (locked) {
                    obj.objDoor.lock();
                }
                else {
                    obj.objDoor.unlock();
                }
            }
        });
}
