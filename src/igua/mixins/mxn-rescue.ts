import { DisplayObject } from "pixi.js";
import { holdf } from "../../lib/game-engine/routines/hold";
import { vnew } from "../../lib/math/vector-type";
import { renderer } from "../current-pixi-renderer";
import { scene } from "../globals";
import { objItemRescueAngel } from "../objects/characters/obj-item-rescue-angel";

export function mxnRescue(obj: DisplayObject) {
    let isRescuing = false;
    let isRescued = false;

    const mxnRescue = {
        get isRescuing() {
            return isRescuing;
        },
        get isRescued() {
            return isRescued;
        },
    };

    return obj
        .merge({ mxnRescue })
        .coro(function* () {
            const { width, height } = obj.getBounds();

            let firstPositionOutOfBoundsNeedsUpdate = true;
            const firstPositionOutOfBounds = vnew();

            yield holdf(() => {
                if (
                    obj.x < -width
                    || obj.x > scene.level.width + width
                    || obj.y < -height
                    || obj.y > scene.level.height + height
                ) {
                    if (firstPositionOutOfBoundsNeedsUpdate) {
                        firstPositionOutOfBounds.at(obj);
                        firstPositionOutOfBoundsNeedsUpdate = false;
                    }
                    return true;
                }

                firstPositionOutOfBoundsNeedsUpdate = true;
                return false;
            }, 60);

            isRescuing = true;

            const rw2 = renderer.width / 2;
            const rh2 = renderer.height / 2;

            const cameraCenter = scene.camera.vcpy().add(rw2, rh2);
            const offset = obj.vcpy().add(cameraCenter, -1).normalize();

            const startingOffset = offset.vcpy().scale(-Math.max(renderer.width, renderer.height));
            startingOffset.x = Math.max(-rw2, Math.min(rw2, startingOffset.x));
            startingOffset.y = Math.max(-rh2, Math.min(rh2, startingOffset.y));
            const startingPosition = cameraCenter.vcpy().add(startingOffset);

            const towSpeed = vnew(0, 0);

            if (obj.x < -width) {
                towSpeed.x = 1;
            }
            else if (obj.x >= scene.level.width + width) {
                towSpeed.x = -1;
            }
            if (obj.y < -height) {
                towSpeed.y = 1;
            }
            else if (obj.y >= scene.level.height + height) {
                towSpeed.y = -1;
            }

            towSpeed.normalize();
            obj.add(towSpeed, 40);

            const angelObj = objItemRescueAngel(obj, towSpeed.scale(0.3)).at(startingPosition).show();
            yield () => angelObj.state.isRescued;

            isRescued = true;
        });
}
