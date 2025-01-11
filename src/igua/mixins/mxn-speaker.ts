import { DisplayObject } from "pixi.js";

interface MxnSpeakerArgs {
    name: string;
    colorPrimary: number;
    colorSecondary: number;
    // TODO head position? Or is that another mixin? mxnHasHead??
}

export function mxnSpeaker(obj: DisplayObject, speaker: MxnSpeakerArgs) {
    return obj.merge({ speaker })
        .dispatches<"mxnSpeaker.speakingStarted">()
        .dispatches<"mxnSpeaker.speakingEnded">();
}
