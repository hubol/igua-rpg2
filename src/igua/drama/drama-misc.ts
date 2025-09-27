import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { PolarInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { ObjDoor } from "../objects/obj-door";
import { ObjIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { playerObj } from "../objects/obj-player";

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

function* levitatePlayer(playerMotionCoroPredicate: Coro.Predicate) {
    playerObj.physicsEnabled = false;
    playerObj.speed.at(0, 0);
    // A hack for making sure the player motion is applied before camera motion
    // This could be solved in other ways
    // But I think this is suitable for now
    const movePlayerObj = container()
        .coro(function* (self) {
            yield playerMotionCoroPredicate;
            self.destroy();
        })
        .show();
    yield () => movePlayerObj.destroyed;
    playerObj.physicsEnabled = true;
}

export const DramaMisc = {
    arriveViaDoor,
    departRoomViaDoor,
    face,
    levitatePlayer,
    walkToDoor,
};
