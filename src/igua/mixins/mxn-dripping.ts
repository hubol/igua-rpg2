import { DisplayObject } from "pixi.js";
import { objWaterDrip } from "../objects/obj-water-drip-source";
import { mxnFxSpawnMany } from "./effects/mxn-fx-spawn-many";
import { mxnDestroyAfterSteps } from "./mxn-destroy-after-steps";

export function mxnDripping(obj: DisplayObject) {
    return obj
        .merge({ dripsPerFrame: 0, dripsTint: 0x68A8D0 })
        .coro(function* (self) {
            self.mixin(mxnFxSpawnMany, {
                get perFrame() {
                    return self.dripsPerFrame;
                },
                spawnObj: () =>
                    objWaterDrip(null)
                        .tinted(self.dripsTint)
                        .mixin(mxnDestroyAfterSteps, 30),
            });
        });
}
