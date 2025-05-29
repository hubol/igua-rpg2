import { DisplayObject } from "pixi.js";
import { Rng } from "../../lib/math/rng";
import { scene } from "../globals";

export function mxnSinePivot(obj: DisplayObject) {
    const fx = Rng.float(0.0125, 0.025);
    const cx = Rng.float(Math.PI * 2);

    const fy = Rng.float(0.025, 0.075);
    const cy = Rng.float(Math.PI * 2);

    return obj.step(self => {
        self.pivot.x = Math.round(Math.sin(scene.ticker.ticks * fx + cx));
        self.pivot.y = Math.round(Math.cos(scene.ticker.ticks * fy + cy) * 2);
    });
}
