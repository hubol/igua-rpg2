import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { mxnDoorNet } from "../mixins/mxn-door-net";

export function scnIndianaLoungeExterior() {
    Jukebox.play(Mzk.PoopPainter);
    const lvl = Lvl.IndianaLoungeExterior();

    lvl.DoorLeft.mixin(mxnDoorNet);
    lvl.DoorRight.mixin(mxnDoorNet);
}
