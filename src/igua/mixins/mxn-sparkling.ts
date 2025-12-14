import { DisplayObject } from "pixi.js";
import { objValuableSparkle } from "../objects/effects/obj-valuable-sparkle";
import { mxnFxSpawnMany } from "./effects/mxn-fx-spawn-many";

export function mxnSparkling(obj: DisplayObject) {
    return obj
        .merge({ sparklesPerFrame: 0, sparklesTint: 0xffffff })
        .coro(function* (self) {
            self.mixin(mxnFxSpawnMany, {
                get perFrame() {
                    return self.sparklesPerFrame;
                },
                spawnObj: () =>
                    objValuableSparkle()
                        .tinted(self.sparklesTint),
            });
        });
}
