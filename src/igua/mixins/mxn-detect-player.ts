import { DisplayObject, Graphics, Point } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { distance } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { playerObj } from "../objects/obj-player";
import { force, mxnPhysics } from "./mxn-physics";

const p = new Point();
const v = vnew();

export function mxnDetectPlayer(obj: DisplayObject) {
    const mxnDetectPlayer = {
        debug: false,
        detectionScore: -1,
    };

    return obj
        .merge({ mxnDetectPlayer })
        .step(() => {
            mxnDetectPlayer.detectionScore--;
        })
        .coro(function* () {
            // TODO: note probably leaks when parent object dies
            const rayObj = objDetectRay().invisible()
                .step(() => {
                    if (rayObj.collides(playerObj)) {
                        mxnDetectPlayer.detectionScore = 60;
                    }

                    if (mxnDetectPlayer.debug) {
                        rayObj.visible = true;
                        rayObj.tint = mxnDetectPlayer.detectionScore > 0 ? 0x00ff00 : 0xffffff;
                    }
                })
                .show();

            const startPos = vnew();

            while (true) {
                rayObj.at(obj.getWorldPosition(p)).add(0, -16);
                force(rayObj, v.at(0, 16));
                rayObj.speed.at(v.at(playerObj).add(rayObj, -1).normalize().scale(32));
                startPos.at(rayObj);
                yield* Coro.race([
                    sleepf(120),
                    () => distance(rayObj, startPos) > 200,
                ]);
            }
        });
}

function objDetectRay() {
    return new Graphics().beginFill(0xffffff).drawRect(-12, -12, 24, 24)
        .mixin(mxnPhysics, {
            physicsRadius: 8,
            gravity: 0,
        });
}
