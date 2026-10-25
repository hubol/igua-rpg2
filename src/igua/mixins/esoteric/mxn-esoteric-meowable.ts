import { DisplayObject } from "pixi.js";
import { show } from "../../drama/show";
import { Cutscene } from "../../globals";
import { playerObj } from "../../objects/obj-player";

export function mxnEsotericMeowable(obj: DisplayObject) {
    return obj.dispatches<"mxnEsotericMeowable:meow">()
        .track(mxnEsotericMeowable);
}

mxnEsotericMeowable.mxnDefault = function mxnEsotericMeowableDefault (obj: DisplayObject) {
    return obj
        .mixin(mxnEsotericMeowable)
        .handles("mxnEsotericMeowable:meow", () => {
            Cutscene.play(function* () {
                yield* show("Hehe, greetings.");
                if (playerObj.status.conditions.fairy.count < 1) {
                    playerObj.status.conditions.fairy.count = 1;
                }
            }, { speaker: obj });
        });
};
