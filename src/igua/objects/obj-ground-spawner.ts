import { DisplayObject } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { holdf } from "../../lib/game-engine/routines/hold";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { mxnPhysics } from "../mixins/mxn-physics";

interface ObjGroundSpawnerArgs {
    objFactory: () => DisplayObject;
    maxDistance: number;
    speedX: number;
}

export function objGroundSpawner({ objFactory, maxDistance, speedX }: ObjGroundSpawnerArgs) {
    let receivedNonGroundMoveEvent = false;

    return container()
        .mixin(mxnPhysics, { gravity: 1, physicsRadius: 8, physicsOffset: [0, -8] })
        .handles("moved", (self, event) => {
            if (!receivedNonGroundMoveEvent) {
                receivedNonGroundMoveEvent = event.hitWall || !event.hitGround;
            }
        })
        .coro(function* (self) {
            self.speed.at(speedX, 0);
            yield* Coro.race([
                () => receivedNonGroundMoveEvent,
                sleepf(Math.ceil(maxDistance / Math.abs(speedX))),
            ]);
            self.destroy();
        })
        .step(self => objFactory().at(self).show());
}
