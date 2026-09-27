import { DisplayObject } from "pixi.js";
import { objText } from "../../assets/fonts";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { StepOrder } from "../objects/step-order";
import { mxnHasHead } from "./mxn-has-head";
import { mxnSpeaker } from "./mxn-speaker";

export function mxnYell(obj: DisplayObject) {
    let life = 0;

    const textObj = objText.MediumIrregular("", { align: "center" })
        .anchored(0.5, 1)
        .invisible()
        .step(self => self.visible = life-- > 0)
        .step(self => {
            if (!self.visible) {
                return;
            }
            mxnYell.applyOverheadPosition(obj, self);
        }, StepOrder.BeforeCamera)
        .show();

    const api = {
        yell(message: string) {
            if (obj.is(mxnSpeaker)) {
                obj.dispatch("mxnSpeaker.speakingStarted");
                obj.coro(function* () {
                    yield sleep(2000);
                    obj.dispatch("mxnSpeaker.speakingEnded");
                });
            }

            textObj.text = message;
            life = 120;
        },
    };

    return obj
        .merge({ mxnYell: api });
}

mxnYell.applyOverheadPosition = function applyOverheadPosition (speakerObj: DisplayObject, textObj: DisplayObject) {
    const head = speakerObj.is(mxnHasHead) ? speakerObj.mxnHead.obj : speakerObj;
    const bounds = head.getWorldBounds();
    textObj.at(bounds.getCenter().x, bounds.top)
        .vround();
};
