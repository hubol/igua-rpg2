import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Rng } from "../../lib/math/rng";

function departRoomViaDoor(departee: DisplayObject | null) {
    const sfx = Rng.choose(Sfx.Interact.DoorOpen0, Sfx.Interact.DoorOpen1);
    if (departee) {
        departee.play(sfx);
        departee.destroy();
    }
    else {
        sfx.play();
    }
}

export const stageDirection = {
    departRoomViaDoor,
};
