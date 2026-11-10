import { ask } from "../drama/show";
import { ObjDoor } from "../objects/obj-door";
import { mxnDoorAutoUnlock } from "./mxn-door-auto-unlock";
import { mxnReleasePoisonGas } from "./mxn-release-poison-gas";

export function mxnDoorPoisonous(doorObj: ObjDoor) {
    let isOpened = false;

    doorObj.speaker.name = "Suspicious Door";

    const poisonDoorObj = doorObj
        .mixin(mxnReleasePoisonGas);

    doorObj.objDoor.lockedCutscene = function* () {
        if (yield* ask("The stench of poison is present. Open anyway?")) {
            poisonDoorObj.mxnReleasePoisonGas.release();
            isOpened = true;
        }
    };

    return doorObj
        .mixin(mxnDoorAutoUnlock, () => !isOpened);
}
