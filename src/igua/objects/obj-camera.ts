import { moveTowards } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { scene } from "../globals";
import { playerObj } from "./obj-player";

const v = vnew();

export function objCamera() {
    // TODO need way to snap to desired position e.g. on level load
    return container().step(self => {
        // TODO camera behavior should be overrideable
        // e.g. there should be modes other than following the player
        self.moveTowards(v.at(playerObj ?? [0, 0]).scale(-1).add(128, 128), 4);

        scene.stage.x = Math.round(self.x);
        scene.stage.y = Math.round(self.y);
    }, 2000)
}