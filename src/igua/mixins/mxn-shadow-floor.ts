import { BLEND_MODES, DisplayObject, Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { VectorSimple } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { scene } from "../globals";
import { CtxTerrainObj } from "../objects/obj-terrain";
import { StepOrder } from "../objects/step-order";
import { scnWorldMap } from "../scenes/scn-world-map";
import { mxnBoilMirrorRotate } from "./mxn-boil-mirror-rotate";

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
            self.visible = obj.visible;
            self.at(obj.position).add(args.offset);
        },
        StepOrder.BeforeCamera,
    ).mixin(mxnBoilMirrorRotate).show(CtxShadowFloorObj.value);

    shadowObj.blendMode = BLEND_MODES.MULTIPLY;

    if (scene.source !== scnWorldMap) {
        shadowObj.mask = CtxTerrainObj.value;
    }

    return obj;
}
