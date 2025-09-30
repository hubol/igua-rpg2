import { DisplayObject } from "pixi.js";
import { DramaWallet } from "../../drama/drama-wallet";
import { show } from "../../drama/show";
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
                "First, please record your number for my associate to verify.",
                "You must pick a number between [1-100]!",
            );
        });
}
