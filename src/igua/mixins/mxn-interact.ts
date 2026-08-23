import { Container, DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { Null } from "../../lib/types/null";
import { Action } from "../core/input";
import { Input, scene } from "../globals";
import { objEsotericOutOfOrderSign } from "../objects/esoteric/obj-esoteric-out-of-order-sign";
import { playerObj } from "../objects/obj-player";
import { mxnHasHead } from "./mxn-has-head";

export const CtxInteract = new SceneLocal(() => {
    const ctx = {
        highestScoreInteractObj: Null<MxnInteract>(),
    };

    scene.stage
        .step(() => {
            const action: Action = scene.isWorldMap ? "WorldMap_Interact" : "Interact";

            if (ctx.highestScoreInteractObj && playerObj.canInteract && Input.justWentDown(action)) {
                ctx.highestScoreInteractObj.interact.onInteract();
            }
        }, -1)
        .step(() => {
            let maximumScore = -1;
            let highestScoreInteractObj = Null<MxnInteract>();

            for (const interactObj of Instances(mxnInteract)) {
                const score = getPlayerOverlapScore(interactObj);
                if (score > -1 && score >= maximumScore) {
                    highestScoreInteractObj = interactObj;
                    maximumScore = score;
                }
            }

            ctx.highestScoreInteractObj = highestScoreInteractObj;
        }, 1);
    return ctx;
}, "CtxInteract");

function getPlayerOverlapScore(interactObj: MxnInteract) {
    if (!interactObj.interact.enabled) {
        return -2;
    }

    let collideObj: DisplayObject = interactObj;
    if (interactObj.mask instanceof Container) {
        collideObj = interactObj.mask;
    }

    if (!playerObj.collides(collideObj)) {
        return -1;
    }

    if (!playerObj.head.collides(collideObj)) {
        return 1;
    }

    if (interactObj.is(mxnHasHead) && interactObj.mxnHead.obj.collides(playerObj)) {
        return 2;
    }

    return interactObj.interact.hotspotObj?.collides(playerObj.head) ? 2 : 1;
}

export function mxnInteract(obj: DisplayObject, interactFn: () => void, hotspotObj = Null<DisplayObject>()) {
    let enabled = true;
    let isOutOfOrder = false;

    const interact = {
        get enabled() {
            return enabled && !isOutOfOrder;
        },
        set enabled(value) {
            enabled = value;
        },
        hotspotObj,
        // TOOD should this be an event?!?!!?
        onInteract: interactFn,
    };

    return obj
        .track(mxnInteract)
        .merge({ interact })
        .step(() => {
            // TODO admittedly bizarre circular dependency
            // Also, iguanas patrolling in front of these signs will become disabled
            // So that is maybe strange
            if (obj.is(objEsotericOutOfOrderSign)) {
                return;
            }
            isOutOfOrder = Boolean(obj.collidesOne(Instances(objEsotericOutOfOrderSign)));
        });
}

export type MxnInteract = ReturnType<typeof mxnInteract>;
