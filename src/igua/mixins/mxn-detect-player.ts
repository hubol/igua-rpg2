import { Container, Graphics } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { Integer, Polar } from "../../lib/math/number-alias-types";
import { distance } from "../../lib/math/vector";
import { VectorSimple, vnew } from "../../lib/math/vector-type";
import { Force } from "../../lib/types/force";
import { ObjAngelEyes, objAngelEyes } from "../objects/enemies/obj-angel-eyes";
import { playerObj } from "../objects/obj-player";
import { mxnEnemy } from "./mxn-enemy";
import { MxnFacingPivot, mxnFacingPivot } from "./mxn-facing-pivot";
import { force, mxnPhysics } from "./mxn-physics";

const v = vnew();

export function mxnDetectPlayer(obj: Container) {
    const mxnDetectPlayer = {
        debug: false,
        detectionScore: -1,
        facing: 0,
        position: vnew(),
        speed: vnew(),
    } satisfies mxnDetectPlayer.Context;

    const polarOffset = vnew();

    let facingPivotObjs = Force<MxnFacingPivot[]>();
    let angelEyesObjs = Force<ObjAngelEyes[]>();

    return obj
        .merge({ mxnDetectPlayer })
        .coro(function* () {
            facingPivotObjs = obj.findIs(mxnFacingPivot);
            angelEyesObjs = obj.findIs(objAngelEyes);
        })
        .step(() => {
            mxnDetectPlayer.detectionScore--;

            if (mxnDetectPlayer.detectionScore > 0) {
                polarOffset.at(mxnDetectPlayer.position).add(obj, -1).scale(1 / 120);
                if (polarOffset.vlength > 1) {
                    polarOffset.normalize();
                }
            }

            if (mxnDetectPlayer.detectionScore < -240) {
                polarOffset.moveTowards(v.at(0, 0), 0.05);
            }

            for (let i = 0; i < angelEyesObjs.length; i++) {
                angelEyesObjs[i].pupilPolarOffsets[0] = polarOffset;
            }

            for (let i = 0; i < facingPivotObjs.length; i++) {
                facingPivotObjs[i].polarOffsets[0] = polarOffset;
            }
        })
        .coro(function* (self) {
            const rayObj = objDetectRay().invisible()
                .step(self => {
                    if (self.collides(playerObj)) {
                        mxnDetectPlayer.detectionScore = 60;
                        self.speed.at(playerObj.speed);
                        self.at(playerObj).add(0, -self.physicsRadius);
                        playerTrackerObj.at(playerObj);
                    }

                    if (mxnDetectPlayer.debug) {
                        self.visible = true;
                        self.tint = mxnDetectPlayer.detectionScore > 0 ? 0x00ff00 : 0xffffff;
                    }
                })
                .show();

            if (self.is(mxnEnemy)) {
                self.handles("damaged", (_, result) => {
                    // TODO may be necessary to check if the player actually caused the damage!
                    if (!result.rejected && result.damaged) {
                        rayObj.at(playerObj);
                    }
                });
            }

            const playerTrackerObj = new Graphics().beginFill(0xffffff).drawCircle(0, 0, 12).invisible()
                .mixin(mxnPhysics, {
                    physicsRadius: 10,
                    physicsOffset: [0, -13],
                    gravity: 0,
                })
                .step(self => {
                    if (mxnDetectPlayer.detectionScore > 15) {
                        self.moveTowards(playerObj, 5);
                        self.y -= 16;
                        force(self, v.at(0, 16));
                        mxnDetectPlayer.position.at(self);
                        mxnDetectPlayer.facing = playerObj.facing;
                        mxnDetectPlayer.speed.at(playerObj.speed);
                    }

                    if (mxnDetectPlayer.debug) {
                        self.visible = true;
                        self.tint = mxnDetectPlayer.detectionScore > 0 ? 0xffff00 : 0xffffff;
                    }
                })
                .show();

            // Crude, but can't seem to rely on `.destroyed`...
            self.on("removed", () => {
                if (rayObj.parent) {
                    rayObj.destroy();
                }
                if (playerTrackerObj.parent) {
                    playerTrackerObj.destroy();
                }
            });

            const startPos = vnew();

            while (true) {
                // TODO very arbitrary value, should probably be configurable per enemy
                // Or detect a head position
                rayObj.at(obj.getWorldPosition()).add(0, -30);
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

export namespace mxnDetectPlayer {
    export type Type = ReturnType<typeof mxnDetectPlayer>;
    export interface Context {
        debug: boolean;
        detectionScore: Integer;
        facing: Polar;
        position: VectorSimple;
        speed: VectorSimple;
    }
}

export type MxnDetectPlayer = ReturnType<typeof mxnDetectPlayer>;

function objDetectRay() {
    return new Graphics().beginFill(0xffffff).drawRect(-16, -16, 32, 32)
        .mixin(mxnPhysics, {
            physicsRadius: 16,
            gravity: 0,
        });
}
