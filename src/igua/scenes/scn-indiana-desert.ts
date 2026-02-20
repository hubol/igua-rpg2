import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { scene } from "../globals";
import { objAngelCactus } from "../objects/enemies/obj-angel-cactus";
import { playerObj } from "../objects/obj-player";
import { StepOrder } from "../objects/step-order";

export function scnIndianaDesert() {
    const lvl = Lvl.IndianaDesert();

    lvl.FrontCactusGroup
        .step(
            self => self.pivot.x = Math.round(scene.camera.x * 0.95),
            StepOrder.Camera,
        );

    objAngelCactus().at(playerObj).add(90, 0).show();
}
