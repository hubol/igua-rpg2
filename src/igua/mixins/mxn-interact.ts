import { DisplayObject } from "pixi.js";
import { playerObj } from "../objects/obj-player";
import { Null } from "../../lib/types/null";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { Input, scene } from "../globals";
import { Instances } from "../../lib/game-engine/instances";
import { mxnHasHead } from "./mxn-has-head";

export const CtxInteract = new SceneLocal(() => {
    const ctx = {
        highestScoreInteractObj: Null<MxnInteract>(),
    };

    scene.stage
        .step(() => {
            if (ctx.highestScoreInteractObj && playerObj.hasControl && Input.justWentDown("Interact")) {
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
    if (!playerObj.collides(interactObj)) {
        return -1;
    }

    if (!playerObj.head.collides(interactObj)) {
        return 1;
    }

    if (interactObj.is(mxnHasHead) && interactObj.mxnHead.obj.collides(playerObj)) {
        return 2;
    }

    return interactObj.interact.hotspotObj?.collides(playerObj.head) ? 2 : 1;
}

export function mxnInteract(obj: DisplayObject, interactFn: () => void, hotspotObj = Null<DisplayObject>()) {
    const interact = {
        hotspotObj,
        // TOOD should this be an event?!?!!?
        onInteract: interactFn,
    };

    return obj
        .track(mxnInteract)
        .merge({ interact });
}

type MxnInteract = ReturnType<typeof mxnInteract>;
