import { BLEND_MODES, DisplayObject, Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { StepOrder } from "../objects/step-order";
import { mxnBoilMirrorRotate } from "./mxn-boil-mirror-rotate";
import { CtxTerrainObj } from "../objects/obj-terrain";
import { VectorSimple } from "../../lib/math/vector-type";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";

interface MxnShadowFloorArgs {
    offset: VectorSimple;
}

const CtxShadowFloorObj = new SceneLocal(
    () => container().named("CtxShadowFloorObj").zIndexed(ZIndex.Shadows).show(),
    "CtxShadowFloorObj",
);

export function mxnShadowFloor(obj: DisplayObject, args: MxnShadowFloorArgs) {
    const shadowObj = Sprite.from(Tx.Light.ShadowIguana).anchored(0.5, 0.5).step(
        self => {
            if (obj.destroyed) {
                self.destroy();
                return;
            }
            self.at(obj.position).add(args.offset);
        },
        StepOrder.Camera - 1,
    ).mixin(mxnBoilMirrorRotate).show(CtxShadowFloorObj.value);

    shadowObj.blendMode = BLEND_MODES.MULTIPLY;
    shadowObj.mask = CtxTerrainObj.value;

    return obj;
}
