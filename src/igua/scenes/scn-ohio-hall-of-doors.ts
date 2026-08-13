import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { mxnDoorHallEmpty } from "../mixins/mxn-door-hall-empty";
import { Rpg } from "../rpg/rpg";

export function scnOhioHallOfDoors() {
    Jukebox.play(Mzk.SodaMachine);
    const lvl = Lvl.OhioHallOfDoors();
    const cosmHallOfDoors = Rpg.microcosms["Ohio.HallOfDoors"];
    lvl.MagicDoor0.mixin(mxnDoorHallEmpty, cosmHallOfDoors, 0);
    lvl.MagicDoor1.mixin(mxnDoorHallEmpty, cosmHallOfDoors, 1);
    lvl.MagicDoor2.mixin(mxnDoorHallEmpty, cosmHallOfDoors, 2);
    lvl.MagicDoor3.mixin(mxnDoorHallEmpty, cosmHallOfDoors, 3);
}
