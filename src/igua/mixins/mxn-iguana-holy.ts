import { objFxPuffyCloud } from "../objects/effects/obj-fx-puffy-cloud";
import { ObjIguanaNpc } from "../objects/obj-iguana-npc";
import { mxnSinePivot } from "./mxn-sine-pivot";

export function mxnIguanaHoly(iguanaNpcObj: ObjIguanaNpc) {
    iguanaNpcObj
        .step(self => self.physicsEnabled = false)
        .autoSorted();

    objFxPuffyCloud(11320797).at(2, -3).zIndexed(-1).show(iguanaNpcObj);
    objFxPuffyCloud(16777215).zIndexed(1).show(iguanaNpcObj);

    return iguanaNpcObj
        .mixin(mxnSinePivot);
}
