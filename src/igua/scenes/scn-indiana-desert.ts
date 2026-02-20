import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { scene } from "../globals";
import { StepOrder } from "../objects/step-order";

export function scnIndianaDesert() {
    const lvl = Lvl.IndianaDesert();

    lvl.FrontCactusGroup
        .step(
            self => self.pivot.x = Math.round(scene.camera.x * 0.95),
            StepOrder.Camera,
        );
}
