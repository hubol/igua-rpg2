import { ObjDoor } from "../objects/obj-door";
import { MicrocosmHallOfDoors } from "../rpg/microcosms/microcosm-hall-of-doors";

export function mxnDoorHallEmpty(
    obj: ObjDoor,
    cosmHallOfDoors: MicrocosmHallOfDoors,
    index: MicrocosmHallOfDoors.Index,
) {
    if (cosmHallOfDoors.isComplete(index)) {
        obj.objDoor.sceneChanger = cosmHallOfDoors.emptySceneChanger;
    }
    return obj;
}
