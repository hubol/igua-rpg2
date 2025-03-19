import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { PolarInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { ObjDoor } from "../objects/obj-door";
import { ObjIguanaLocomotive } from "../objects/obj-iguana-locomotive";

function departRoomViaDoor(departee: DisplayObject | null) {
    const sfx = getDoorSfx();
    if (departee) {
        departee.play(sfx);
        departee.destroy();
    }
    else {
        sfx.play();
    }
}

function getDoorSfx() {
    return Rng.choose(Sfx.Interact.DoorOpen0, Sfx.Interact.DoorOpen1);
}

function arriveViaDoor(arriver: DisplayObject | null) {
    const sfx = getDoorSfx();

    if (arriver) {
        arriver.play(sfx);
        arriver.visible = true;
    }
    else {
        sfx.play();
    }
}

function walkToDoor(walker: ObjIguanaLocomotive, door: ObjDoor) {
    return walker.walkTo(walker.x < door.x ? door.x : (door.x + 32));
}

walkToDoor.andLock = function* (locker: ObjIguanaLocomotive, doorObj: ObjDoor) {
    yield* walkToDoor(locker, doorObj);
    doorObj.lock();
    yield sleep(750);
};

walkToDoor.andUnlock = function* (unlockerObj: ObjIguanaLocomotive, doorObj: ObjDoor) {
    yield* walkToDoor(unlockerObj, doorObj);
    doorObj.unlock();
    yield sleep(750);
};

function face(iguanaObj: ObjIguanaLocomotive, facing: PolarInt, rate = "default") {
    if (iguanaObj.facing !== facing) {
        iguanaObj.auto.facing = facing;
        return sleep(750);
    }

    return sleep(0);
}

export const DramaMisc = {
    arriveViaDoor,
    departRoomViaDoor,
    face,
    walkToDoor,
};
