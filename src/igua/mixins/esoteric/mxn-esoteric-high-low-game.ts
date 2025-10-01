import { DisplayObject } from "pixi.js";
import { factor, interpvr } from "../../../lib/game-engine/routines/interp";
import { renderer } from "../../current-pixi-renderer";
import { DramaMisc } from "../../drama/drama-misc";
import { DramaWallet } from "../../drama/drama-wallet";
import { ask, show } from "../../drama/show";
import { layers } from "../../globals";
import { objEsotericLineGraph } from "../../objects/esoteric/obj-esoteric-line-graph";
import { mxnCutscene } from "../mxn-cutscene";
import { mxnSpeaker } from "../mxn-speaker";

export function mxnEsotericHighLowGame(obj: DisplayObject) {
    return obj
        .mixin(mxnCutscene, function* () {
            const name = obj.is(mxnSpeaker) ? obj.speaker.name : "???";
            yield* show(
                `Welcome one! Welcome all! Step right up! Step right and up and the great ${name} will read YOUR VERY MIND!!`,
                "That's right!! UnthinkaBLY!! The OTHERWORLDY!!! Uh, -Ly!!!! Hypnosis--no, mind reading, SI!!!",
                "For a small FEE of 10 valuables, you can SEE my POWER!!! And if I guess incorrectly, you will quintuple your INVESTMENT!!! You FUCK!!!!",
            );

            if (!(yield* DramaWallet.askSpendValuables("What'll it BE? 10 valuables to SEE?!", 10, "gambling"))) {
                return;
            }

            yield* show(
                "First, please record your number on a sheet of paper. I will not look at it.",
                "You must pick a number between [1-100]!",
            );

            let value = null;

            while (value === null) {
                // TODO maybe it just shouldnt be possible to get null here
                value = yield* DramaMisc.askInteger("Pick a number between [1-100]", { min: 1, max: 100 });
            }

            const lineGraphObj = objEsotericLineGraph({ min: 1, max: 100, width: 128, height: 6 })
                .at((renderer.width - 128) / 2, 250)
                .coro(function* (self) {
                    yield interpvr(self).factor(factor.sine).translate(0, -48).over(400);
                })
                .show(layers.overlay.messages);

            let start = 1;
            let end = 100;

            while (true) {
                const check = Math.floor((start + end) / 2);
                const result = yield* ask(`Is your number ${check}?`, "Too low!", "Too high!", "Yes!");
                if (result === 0) {
                    start = Math.min(check + 1, end);
                }
                else if (result === 1) {
                    end = Math.max(start, check - 1);
                }
                else {
                    // TODO
                    break;
                }

                lineGraphObj.objEsotericLineGraph.controls.range.start = start;
                lineGraphObj.objEsotericLineGraph.controls.range.end = end;
            }
        });
}
