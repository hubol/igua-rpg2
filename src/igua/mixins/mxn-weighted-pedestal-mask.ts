import { DisplayObject } from "pixi.js";
import { Null } from "../../lib/types/null";
import { TerrainGraphics, TerrainMesh } from "../objects/obj-terrain";
import { ObjWeightedPedestal } from "../objects/obj-weighted-pedestal";

interface MxnWeightedPedestalMaskArgs {
    terrainObjs: ReadonlyArray<TerrainGraphics | TerrainMesh>;
    decalObjs: ReadonlyArray<DisplayObject>;
}

export function mxnWeightedPedestalMask(
    obj: ObjWeightedPedestal,
    { terrainObjs, decalObjs }: MxnWeightedPedestalMaskArgs,
) {
    let appliedMaskState = Null<boolean>();

    const terrainObjVisibility = new Map<TerrainGraphics | TerrainMesh, boolean>();

    for (const terrainObj of terrainObjs) {
        terrainObjVisibility.set(terrainObj, terrainObj.visible);
    }

    // TODO VFX probably
    function applyMask() {
        const maskState = obj.rpgWeightedPedestal.isSufficientlyWeighted;

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
        appliedMaskState = maskState;
    }

    applyMask();

    return obj.step(applyMask);
}
