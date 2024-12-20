import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { scene } from "../globals";
import { playerObj } from "./obj-player";
import { StepOrder } from "./step-order";

type CameraMode = "follow-player" | "controlled";

export function objCamera() {
    // TODO need way to snap to desired position e.g. on level load
    return container().merge({ mode: <CameraMode> "follow-player" }).step(self => {
        // TODO camera behavior should be overrideable
        // e.g. there should be modes other than following the player
        if (self.mode === "follow-player" && playerObj && !playerObj.destroyed) {
            self.at(playerObj).add(-renderer.width / 2, -renderer.height / 2);
        }

        // TODO switch for this?
        self.x = Math.max(0, Math.min(self.x, scene.level.width - renderer.width));
        self.y = Math.max(0, Math.min(self.y, scene.level.height - renderer.height));

        scene.stage.x = Math.round(-self.x);
        scene.stage.y = Math.round(-self.y);

        scene.parallaxStage.x = Math.round(-self.x * 0.8);
        scene.parallaxStage.y = Math.round(-self.y * 0.8);
    }, StepOrder.Camera);
}
