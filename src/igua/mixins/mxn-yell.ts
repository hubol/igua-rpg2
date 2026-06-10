import { DisplayObject } from "pixi.js";
import { objText } from "../../assets/fonts";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { mxnHasHead } from "./mxn-has-head";
import { mxnSpeaker } from "./mxn-speaker";

export function mxnYell(obj: DisplayObject) {
    let life = 0;

    const textObj = objText.MediumIrregular("", { align: "center" })
        .anchored(0.5, 1)
        .invisible()
        .step(self => self.visible = life-- > 0)
        .show();

    const api = {
        yell(message: string) {
            if (obj.is(mxnSpeaker)) {
                obj.dispatch("mxnSpeaker.speakingStarted");
                obj.coro(function* () {
                    yield sleep(250);
                    obj.dispatch("mxnSpeaker.speakingEnded");
                });
            }
            const head = obj.is(mxnHasHead) ? obj.mxnHead.obj : obj;
            const bounds = head.getWorldBounds();
            textObj.at(bounds.getCenter().x, bounds.top);
            textObj.text = message;
            life = 120;
        },
    };

    return obj
        .merge({ mxnYell: api });
}
