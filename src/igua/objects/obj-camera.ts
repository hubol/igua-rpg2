import { DisplayObject } from "pixi.js";
import { Logger } from "../../lib/game-engine/logger";
import { vequals } from "../../lib/math/vector";
import { distance } from "../../lib/math/vector";
import { Vector, vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { renderer } from "../current-pixi-renderer";
import { scene } from "../globals";
import { playerObj } from "./obj-player";
import { StepOrder } from "./step-order";

function getCameraPositionToFrameSubject(
    vector: DisplayObject | Vector,
    subjectObj: DisplayObject,
    framing: objCamera.Framing,
) {
    if (subjectObj && !subjectObj.destroyed) {
        if (framing === "snap_to_renderer_size") {
            vector.at(subjectObj);
            vector.x = Math.floor(vector.x / renderer.width) * renderer.width;
            vector.y = Math.floor(vector.y / renderer.height) * renderer.height;
            return vector;
        }

        vector.at(subjectObj).add(-renderer.width / 2, -renderer.height / 2);
        vector.x = Math.max(0, Math.min(vector.x, scene.level.width - renderer.width));
        vector.y = Math.max(0, Math.min(vector.y, scene.level.height - renderer.height));

        return vector;
    }

    return null;
}

const v = vnew();

export function objCamera(isWorldMap: boolean) {
    // TODO need way to snap to desired position e.g. on level load

    let subjectToFollowObj = Null<DisplayObject>();

    const auto = {
        followSubject(subjectObj: DisplayObject) {
            obj.mode = "follow_subject";
            subjectToFollowObj = subjectObj;
        },
        panToSubject(subjectObj: DisplayObject) {
            obj.mode = "controlled";
            const position = getCameraPositionToFrameSubject(vnew(), subjectObj, framing) ?? obj;

            return () => {
                obj.moveTowards(position, 6);
                return vequals(obj, position);
            };
        },
        panToPlayer() {
            return this.panToSubject(playerObj);
        },
        get isFramingPlayer() {
            const playerCameraPosition = getCameraPositionToFrameSubject(v, playerObj, framing);
            return !playerCameraPosition || distance(playerCameraPosition, obj) < 2;
        },
    };

    const parallaxFactor = isWorldMap ? 1 : 0.8;

    let mode = Null<objCamera.Mode>();
    let framing: objCamera.Framing = "default";

    // TODO not sure if mode should be exposed...
    const obj = container().merge({
        defaultMode: <objCamera.Mode> "follow_player",
        get mode() {
            if (!mode) {
                mode = this.defaultMode;
            }
            return mode;
        },
        set mode(value) {
            mode = value;
        },
        get framing() {
            return framing;
        },
        set framing(value) {
            framing = value;
        },
        auto,
    }).step(self => {
        if (self.mode === "follow_player") {
            getCameraPositionToFrameSubject(self, playerObj, framing);
        }
        else if (self.mode === "move_towards_player") {
            getCameraPositionToFrameSubject(v, playerObj, framing);
            self.moveTowards(v, 2);
        }
        else if (self.mode === "follow_subject") {
            if (!subjectToFollowObj) {
                Logger.logAssertError(
                    "objCamera.step",
                    new Error("subjectToFollowObj is unset while mode is follow-subject"),
                );
            }
            else if (!subjectToFollowObj.destroyed) {
                getCameraPositionToFrameSubject(self, subjectToFollowObj, framing);
            }
        }

        // TODO switch for this?
        self.x = Math.max(0, Math.min(self.x, scene.level.width - renderer.width));
        self.y = Math.max(0, Math.min(self.y, scene.level.height - renderer.height));

        scene.stage.x = Math.round(-self.x);
        scene.stage.y = Math.round(-self.y);

        scene.parallaxStage.x = Math.round(-self.x * parallaxFactor);
        scene.parallaxStage.y = Math.round(-self.y * parallaxFactor);
    }, StepOrder.Camera);

    return obj;
}

namespace objCamera {
    export type Mode = "follow_player" | "follow_subject" | "controlled" | "move_towards_player";
    export type Framing = "default" | "snap_to_renderer_size";
}
