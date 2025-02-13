import { DisplayObject } from "pixi.js";
import { Vector, vequals, vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { scene } from "../globals";
import { playerObj } from "./obj-player";
import { StepOrder } from "./step-order";
import { distance } from "../../lib/math/vector";

type CameraMode = "follow-player" | "controlled";

function getCameraPositionToFrameSubject(vector: DisplayObject | Vector, subjectObj: DisplayObject) {
    if (subjectObj && !subjectObj.destroyed) {
        vector.at(subjectObj).add(-renderer.width / 2, -renderer.height / 2);
        return vector;
    }

    return null;
}

const v = vnew();

export function objCamera() {
    // TODO need way to snap to desired position e.g. on level load

    const auto = {
        panToSubject(subjectObj: DisplayObject) {
            obj.mode = "controlled";
            const position = getCameraPositionToFrameSubject(vnew(), subjectObj) ?? obj;

            return () => {
                obj.moveTowards(position, 6);
                return vequals(obj, position);
            };
        },
        panToPlayer() {
            return this.panToSubject(playerObj);
        },
        get isFramingPlayer() {
            const playerCameraPosition = getCameraPositionToFrameSubject(v, playerObj);
            return !playerCameraPosition || distance(playerCameraPosition, obj) < 2;
        },
    };

    const obj = container().merge({ mode: <CameraMode> "follow-player", auto }).step(self => {
        if (self.mode === "follow-player") {
            getCameraPositionToFrameSubject(self, playerObj);
        }

        // TODO switch for this?
        self.x = Math.max(0, Math.min(self.x, scene.level.width - renderer.width));
        self.y = Math.max(0, Math.min(self.y, scene.level.height - renderer.height));

        scene.stage.x = Math.round(-self.x);
        scene.stage.y = Math.round(-self.y);

        scene.parallaxStage.x = Math.round(-self.x * 0.8);
        scene.parallaxStage.y = Math.round(-self.y * 0.8);
    }, StepOrder.Camera);

    return obj;
}
