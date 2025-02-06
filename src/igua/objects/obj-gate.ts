import { Graphics } from "pixi.js";
import { OgmoFactory } from "../ogmo/factory";
import { playerObj } from "./obj-player";
import { Cutscene } from "../globals";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { SceneChanger } from "../systems/scene-changer";
import { SceneLocal } from "../../lib/game-engine/scene-local";

export const CtxGate = new SceneLocal(() => ({ isGateTransitionActive: false }), "CtxGate");

type Orientation = "horizontal" | "vertical";

export function objGate(ogmoEntity: OgmoFactory.Entity<"GateHorizontal" | "GateVertical">, orientation: Orientation) {
    const gfx = new Graphics().beginFill(0xffffff).drawRect(0, 0, 1, 1).scaled(96, 1);
    if (ogmoEntity.flippedX) {
        gfx.pivot.x = 1;
    }

    const { sceneName, checkpointName } = ogmoEntity.values;

    const forward = getForward(ogmoEntity, orientation);
    const predicate = forwardPredicates[forward];
    const pilotFn = forwardPilotFns[forward];

    const sceneChanger = SceneChanger.create({ sceneName, checkpointName });

    if (sceneChanger) {
        gfx.coro(function* (self) {
            yield () => playerObj.hasControl && predicate() && self.collides(playerObj);
            // TODO is this really a cutscene?
            // Cutscenes are (thankfully?) not interruptible.
            // Either way, probably don't want the letterbox to appear!
            Cutscene.play(function* () {
                CtxGate.value.isGateTransitionActive = true;
                playerObj.isBeingPiloted = true;
                playerObj.isDucking = false;
                playerObj.isMovingLeft = false;
                playerObj.isMovingRight = false;
                pilotFn();
                yield sleepf(20);
                // TODO need to escape ticker and execute?
                sceneChanger.changeScene();
            }, { letterbox: false });
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
    up: () => playerObj.gravity = 0,
    down: () => {},
};
