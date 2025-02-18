import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Rng } from "../../lib/math/rng";

function departRoomViaDoor(departee: DisplayObject | null) {
    departee?.destroy();
    Rng.choose(Sfx.Interact.DoorOpen0, Sfx.Interact.DoorOpen1).play();
}

export const stageDirection = {
    departRoomViaDoor,
};
