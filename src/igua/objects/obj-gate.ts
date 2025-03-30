import { Graphics } from "pixi.js";
import { Logger } from "../../lib/game-engine/logger";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { Cutscene } from "../globals";
import { OgmoFactory } from "../ogmo/factory";
import { SceneChanger } from "../systems/scene-changer";
import { playerObj } from "./obj-player";

export const CtxGate = new SceneLocal(() => ({ isGateTransitionActive: false }), "CtxGate");

type Orientation = "horizontal" | "vertical";

export function objGate(ogmoEntity: OgmoFactory.Entity<"GateHorizontal" | "GateVertical">, orientation: Orientation) {
    const gfx = new Graphics().beginFill(0xffffff).drawRect(0, 0, 1, 1).scaled(
        orientation === "horizontal" ? 96 : 1,
        orientation === "vertical" ? 96 : 1,
    );
    if (ogmoEntity.flippedX) {
        gfx.pivot.x = 1;
    }
    if (ogmoEntity.flippedY) {
        gfx.pivot.y = 1;
    }

    const { sceneName, checkpointName } = ogmoEntity.values;

    const forward = getForward(ogmoEntity, orientation);
    const predicate = forwardPredicates[forward];
    const pilotFn = forwardPilotFns[forward];

    const sceneChanger = SceneChanger.create({ sceneName, checkpointName });

    if (sceneChanger) {
        gfx.coro(function* (self) {
            while (true) {
                let retry = false;
                yield () => predicate() && self.collides(playerObj);
                Cutscene.play(function* () {
                    // Rather awkward, but since cutscenes, and therefore gate transitions are bufferable,
                    // then it is possible to touch an upwards gate during a cutscene, and fall back down
                    // I could see this being a problem for other directions too.
                    // But let's just patch this one for now I guess, haha.
                    if (forward === "up") {
                        if (playerObj.y > 0 && (!predicate() || !self.collides(playerObj))) {
                            Logger.logInfo(
                                "objGate.coro",
                                "Upwards gate transition was aborted because the player appears to have fallen since the Cutscene was requested",
                                { playerPosition: playerObj.vcpy(), playerSpeed: playerObj.speed.vcpy() },
                            );
                            retry = true;
                            return;
                        }
                    }

                    CtxGate.value.isGateTransitionActive = true;
                    playerObj.isBeingPiloted = true;
                    playerObj.isDucking = false;

                    if (orientation === "horizontal") {
                        playerObj.isMovingLeft = false;
                        playerObj.isMovingRight = false;
                    }
                    pilotFn();
                    yield sleepf(20);
                    // TODO need to escape ticker and execute?
                    sceneChanger.changeScene();
                }, { letterbox: false });

                yield () => retry;
            }
        });
    }

    return gfx.invisible();
}

function getForward(ogmo: OgmoFactory.EntityCommon, orientation: Orientation) {
    if (orientation === "horizontal") {
        return ogmo.flippedX ? "left" : "right";
    }
    return ogmo.flippedY ? "up" : "down";
}

type Forward = ReturnType<typeof getForward>;

const forwardPredicates: Record<Forward, () => boolean> = {
    left: () => playerObj.speed.x < 0,
    right: () => playerObj.speed.x > 0,
    up: () => playerObj.speed.y < 0,
    down: () => playerObj.speed.y > 0,
};

const forwardPilotFns: Record<Forward, () => void> = {
    left: () => playerObj.isMovingLeft = true,
    right: () => playerObj.isMovingRight = true,
    up: () => {
        playerObj.gravity = 0;
        // TODO probably a const!
        playerObj.speed.y = Math.min(playerObj.speed.y, -5);
    },
    down: () => {},
};
