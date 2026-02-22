import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { scene } from "../globals";
import { StepOrder } from "../objects/step-order";

export function scnIndianaDesert() {
    Jukebox.play(Mzk.RiceRoyalty);
    const lvl = Lvl.IndianaDesert();

    lvl.FrontCactusGroup
        .step(
            self => self.pivot.x = Math.round(scene.camera.x * 0.95),
            StepOrder.Camera,
        );
}
