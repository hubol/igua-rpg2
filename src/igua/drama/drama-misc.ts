import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Rng } from "../../lib/math/rng";

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

export const DramaMisc = {
    arriveViaDoor,
    departRoomViaDoor,
};
