import { container } from "../../lib/pixi/container";
import { renderer, scene } from "../globals";
import { playerObj } from "./obj-player";
import { StepOrder } from "./step-order";

export function objCamera() {
    // TODO need way to snap to desired position e.g. on level load
    return container().step(self => {
        // TODO camera behavior should be overrideable
        // e.g. there should be modes other than following the player
        if (playerObj && !playerObj.destroyed) {
            self.at(playerObj).add(-128, -128);
        }

        // TODO switch for this?
        self.x = Math.max(0, Math.min(self.x, scene.level.width - renderer.width));
        self.y = Math.max(0, Math.min(self.y, scene.level.height - renderer.height));

        scene.stage.x = Math.round(-self.x);
        scene.stage.y = Math.round(-self.y);
    }, StepOrder.Camera);
}
