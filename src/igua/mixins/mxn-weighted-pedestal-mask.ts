import { DisplayObject } from "pixi.js";
import { Null } from "../../lib/types/null";
import { TerrainGraphics, TerrainMesh } from "../objects/obj-terrain";
import { ObjWeightedPedestal } from "../objects/obj-weighted-pedestal";
import { MxnInteract } from "./mxn-interact";

interface MxnWeightedPedestalMaskArgs {
    terrainObjs?: ReadonlyArray<TerrainGraphics | TerrainMesh>;
    decalObjs?: ReadonlyArray<DisplayObject>;
    interactObjs?: ReadonlyArray<MxnInteract>;
    maskWhenWeighted?: boolean;
}

export function mxnWeightedPedestalMask(
    obj: ObjWeightedPedestal,
    { terrainObjs = [], decalObjs = [], interactObjs = [], maskWhenWeighted = true }: MxnWeightedPedestalMaskArgs,
) {
    let appliedMaskState = Null<boolean>();

    const terrainObjVisibility = new Map<TerrainGraphics | TerrainMesh, boolean>();

    for (const terrainObj of terrainObjs) {
        terrainObjVisibility.set(terrainObj, terrainObj.visible);
    }

    // TODO VFX probably
    function applyMask() {
        const maskState = obj.rpgWeightedPedestal.isSufficientlyWeighted === maskWhenWeighted;

        if (appliedMaskState === maskState) {
            return;
        }

        for (const terrainObj of terrainObjs) {
            terrainObj.enabled = maskState;
            terrainObj.visible = maskState ? (terrainObjVisibility.get(terrainObj) ?? false) : false;
        }
        for (const decalObj of decalObjs) {
            decalObj.visible = maskState;
        }
        for (const interactObj of interactObjs) {
            interactObj.visible = maskState;
            interactObj.interact.enabled = maskState;
        }
        appliedMaskState = maskState;
    }

    applyMask();

    return obj.step(applyMask);
}
