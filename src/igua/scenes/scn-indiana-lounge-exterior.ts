import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { mxnDoorNet } from "../mixins/mxn-door-net";

export function scnIndianaLoungeExterior() {
    const lvl = Lvl.IndianaLoungeExterior();

    lvl.DoorLeft.mixin(mxnDoorNet);
    lvl.DoorRight.mixin(mxnDoorNet);
}
