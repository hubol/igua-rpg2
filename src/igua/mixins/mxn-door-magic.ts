import { show } from "../drama/show";
import { ObjDoor } from "../objects/obj-door";

export function mxnDoorMagic(obj: ObjDoor) {
    return obj.coro(function* () {
        obj.speaker.name = "Magic Door";
        obj.speaker.colorPrimary = 0x4146A8;
        obj.speaker.colorSecondary = 0x202470;
        obj.objDoor.style = "Magic";
        obj.objDoor.lockedCutscene = function* () {
            yield* show("You are gay.");
        };
    });
}
