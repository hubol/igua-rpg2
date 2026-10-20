import { ObjDoor } from "../objects/obj-door";
import { MicrocosmHallOfDoors } from "../rpg/microcosms/microcosm-hall-of-doors";
import { mxnSparkling } from "./mxn-sparkling";

export function mxnDoorHallEmpty(
    obj: ObjDoor,
    cosmHallOfDoors: MicrocosmHallOfDoors,
    index: MicrocosmHallOfDoors.Index,
) {
    if (cosmHallOfDoors.isDoorComplete(index)) {
        obj.objDoor.sceneChanger = cosmHallOfDoors.emptySceneChanger;
    }
    else {
        obj.mixin(mxnSparkling)
            .step(self => self.sparklesPerFrame = self.objDoor.locked ? 0 : 0.2)
            .sparklesTint = 0x4146A8;
    }
    return obj;
}
